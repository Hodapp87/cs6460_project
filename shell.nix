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
  }

# python3 -m http.server
