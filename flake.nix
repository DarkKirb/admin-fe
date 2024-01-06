{
  description = "Description for the project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    flake-parts.url = "github:hercules-ci/flake-parts";
    devshell.url = "github:numtide/devshell";
    nixtoo.url = "github:DarkKirb/nixtoo";
    nixtoo.flake = false;
  };

  outputs = inputs @ {flake-parts, ...}:
    flake-parts.lib.mkFlake {inherit inputs;} {
      imports = [
        inputs.devshell.flakeModule
      ];
      systems = ["x86_64-linux" "aarch64-linux"];
      perSystem = {
        config,
        self',
        inputs',
        pkgs,
        system,
        ...
      }: {
        _module.args.pkgs = import inputs.nixpkgs {
          inherit system;
          overlays = [
            (import "${inputs.nixtoo}/overlay.nix")
            inputs.self.overlays.default
          ];
          config.contentAddressedByDefault = true;
        };

        devshells.default.devshell.packages = with pkgs; [
          nodejs
          yarn
          yarn2nix
          python3
          libsass
          pkg-config
          gnumake
          gcc
        ];
        packages.admin-fe = pkgs.admin-fe;
        formatter = pkgs.alejandra;
      };
      flake = {
        hydraJobs = {
          inherit (inputs.self) devShells packages formatter;
        };
        overlays.default = self: super: {
          admin-fe = with self;
            mkYarnPackage rec {
              pname = "admin-fe";
              version = inputs.self.lastModifiedDate;
              src = ./.;

              packageJSON = ./package.json;
              yarnLock = ./yarn.lock;
              yarnNix = ./yarn.nix;

              nativeBuildInputs = [
                jpegoptim
                oxipng
                nodePackages.svgo
              ];

              configurePhase = "cp -r $node_modules node_modules";

              buildPhase = ''
                export NODE_OPTIONS=--openssl-legacy-provider
                yarn build:prod --offline
              '';
              installPhase = "cp -rv dist $out";
              distPhase = ''
                # (Losslessly) optimise compression of image artifacts
                find $out -type f -name '*.jpg' -execdir ${jpegoptim}/bin/jpegoptim -w$NIX_BUILD_CORES {} \;
                find $out -type f -name '*.png' -execdir ${oxipng}/bin/oxipng -o max -t $NIX_BUILD_CORES {} \;
                find $out -type f -name '*.svg' -execdir ${nodePackages.svgo}/bin/svgo {} \;
              '';
              yarnPreBuild = ''
                mkdir -p $HOME/.node-gyp/${nodejs.version}
                echo 9 > $HOME/.node-gyp/${nodejs.version}/installVersion
                ln -sfv ${nodejs}/include $HOME/.node-gyp/${nodejs.version}
                export npm_config_nodedir=${nodejs}
              '';
              pkgConfig = {
                node-sass = {
                  buildInputs = [python3 libsass pkg-config];
                  postInstall = ''
                    LIBSASS_EXT=auto yarn --offline run build
                    rm build/config.gypi
                  '';
                };
              };
            };
        };
      };
    };
}
