{ pkgs ? import <nixpkgs> {} }:

# Taken from the Cask file in the distribution
let
 emacsWithPackages = (pkgs.emacsPackagesNgGen pkgs.emacs25-nox).emacsWithPackages;
 emacs-custom = emacsWithPackages (epkgs: (with epkgs.melpaPackages; [
    dash
    dash-functional
    f
    company
    s
    htmlize
  ]) ++ (with epkgs.orgPackages; [
    org-plus-contrib
  ])
  ); in pkgs.stdenv.mkDerivation {
    name = "emacsLeanbook";
    buildInputs = [emacs-custom pkgs.python3 pkgs.mercurial];
    # Also needs: TeX

    # Add "myWebApp ? { outPath = ./.; name = "myWebApp"; }" to
    # arguments of this file to use this (and still one must run 'eval
    # $buildPhase' in the shell first if using this in nix-shell)
    #
    # To produce bower-packages.nix, make a bower.json with:
    # {"name": "my-web-app", "dependencies": {"juicy-ace-editor": "~2.0.1"}}
    # ...and run this through bower2nix.
    #
    #bowerComponents = pkgs.buildBowerComponents {
    #  name = "my-web-app";
    #  generated = ./bower-packages.nix;
    #  src = myWebApp;
    #};
    #buildPhase = ''
    #cp  --reflink=auto --no-preserve=mode -R $bowerComponents/bower_components .
    #'';
  }

# python3 -m http.server
