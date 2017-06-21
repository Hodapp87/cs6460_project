CASK_BIN ?= cask
EMACS_BIN ?= emacs

all:

.cask: Cask
	EMACS=$(EMACS_BIN) $(CASK_BIN) install
#	touch .cask

install-cask:
	echo "(ignored)"
#	curl -fsSkL https://raw.github.com/cask/cask/master/go | python

pygments-main: install-pygments

install-pygments:
	if [ ! -d pygments-main ] ; then hg clone https://bitbucket.org/leanprover/pygments-main && cd pygments-main && python setup.py build; fi

.PHONY: all install-cask
