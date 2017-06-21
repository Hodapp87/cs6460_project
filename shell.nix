{ pkgs ? import <nixpkgs> {} }:

let
 emacsWithPackages = (pkgs.emacsPackagesNgGen pkgs.emacs25-nox).emacsWithPackages;
 myEmacs = emacsWithPackages (epkgs: (with epkgs.melpaPackages; [
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
    buildInputs = [myEmacs pkgs.mercurial];
    # Also needs: TeX
  }
