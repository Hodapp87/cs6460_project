cs6460_project
====

This is the source code for a website that I put together for a class
project for CS6460 (Educational Technology) in OMSCS.  The 'live'
version of the website is at:
https://hodapp87.github.io/cs6460_project/

The paper referring to this is available
at [paper/chodapp3_final_paper.pdf](./paper/chodapp3_final_paper.pdf).

Building
----

If you wish to build and/or host this yourself:

1. Use the `shell.nix` with [Nix](https://nixos.org/nix/) &
   `nix-shell` to set up an environment.  (This originally used Cask,
   but I don't use Cask.  It is mainly to check out a specific
   configuration of Emacs and LaTeX.)
2. Enter the `docs` directory.
3. Run `make`.
4. The `docs` directory now contains the website.  You may copy this
   directly to a webserver (no other server-side components are
   needed), or you may run something like `python3 -m http.server` to
   host a local webserver.  Due to how it refers to resources, you
   can't simply access it locally via `file:///`.

Known Bugs
----

1. MathJax does not render right upon switching sections (a refresh is required)
2. Safari browser seems to have problems
3. Layout mode doesn't really work right
4. Some Chapter 3 items appear to have precision issues surrounding
   rotations, but only when matrices are used.

Acknowledgements
----

The source code here started from
https://github.com/leanprover/mkleanbook and incorporates
https://github.com/gportelli/pocket.gl.
