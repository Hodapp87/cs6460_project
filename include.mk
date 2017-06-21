CASK_BIN ?= cask
EMACS_BIN ?= emacs
LEAN_BIN ?= lean
ORGS  := $(sort $(wildcard [0-9A][0-9]_*.org))
HTMLS := $(ORGS:.org=.html)
TEXS  := $(ORGS:.org=.tex)
PDFS  := $(ORGS:.org=.pdf)
NAV_DATA := js/nav_data.js

CASK_EMACS := cd $(MKLEANBOOK_PATH) && $(EMACS_BIN)

BIBFILES ?= lean.bib

COMBINED ?= book
TITLE ?= mkleanbook
AUTHORS ?=
COPYRIGHT_NOTICE ?=

all: htmls $(COMBINED).pdf

htmls: $(HTMLS) copy-html-assets $(NAV_DATA)

$(COMBINED).org: $(ORGS)
	$(MKLEANBOOK_PATH)/merge_chapters.sh >$@ $+

%.tmphtml.org: %.org $(MKLEANBOOK_PATH)/header/html.org $(MKLEANBOOK_PATH)/footer/bib.html.org
	cat $(MKLEANBOOK_PATH)/header/html.org $< > $@
	(grep "\\\\cite{" $< && cat footer/bib.html.org >> $@) || true

.PRECIOUS: %.html
%.html: %.tmphtml.org $(MKLEANBOOK_PATH)/.cask $(MKLEANBOOK_PATH)/elisp/org-html-export.el $(BIBFILES)
	(cd $(MKLEANBOOK_PATH) && $(EMACS_BIN) \
	  --no-site-file --no-site-lisp -q --batch \
	  -l elisp/org-html-export.el \
	  --visit $(PWD)/$< \
	  -f org-html-export-to-html) && \
	mv $*.tmphtml.html $@

%.tmptex.org: %.org $(MKLEANBOOK_PATH)/header/latex.org $(MKLEANBOOK_PATH)/footer/latex.org
	cat $(MKLEANBOOK_PATH)/header/latex.org $< $(MKLEANBOOK_PATH)/footer/latex.org >$@

.PRECIOUS: %.tex
%.tex: %.tmptex.org $(MKLEANBOOK_PATH)/.cask $(MKLEANBOOK_PATH)/elisp/org-pdf-export.el
	(cd $(MKLEANBOOK_PATH) && $(EMACS_BIN) \
	  --no-site-file --no-site-lisp -q --batch \
	  -l elisp/org-pdf-export.el \
	  --visit $(PWD)/$< \
	  -f org-latex-export-to-latex) && \
	mv $*.tmptex.tex $@

%.pdf: %.tex pygments-main gitHeadInfo.gin
	PATH="$(PWD)/pygments-main:$(PATH)" TEXINPUTS="$(MKLEANBOOK_PATH)/:$(TEXINPUTS)" latexmk -interaction=errorstopmode --xelatex --shell-escape $<

$(MKLEANBOOK_PATH)/.cask:
	echo "(ignored)"
#	$(MAKE) -C $(MKLEANBOOK_PATH) .cask

clean:
	rm -rf $(HTMLS) \
	       ${PDFS} \
	       ${TEXS} \
	       *.tmptex.org *.tmphtml.org \
	       $(COMBINED).* \
	       *.acn *.aux *.glo *.idx *.ist *.log *.out *.toc *.fdb_latexmk *.fls *.ilg *.ind *.bbl *.blg \
	       css fonts images js index.html juicy-ace-editor.html \
	       *.out.pyg *.pyg \
	       gitHeadInfo.gin \
	       [0-9][0-9]*.lean \
	       pygments-main \
	       _minted-*

dist-clean: clean
	rm -rf .cask watchman pygments-main

install-cask:
	echo "(ignored)"
#	curl -fsSkL https://raw.github.com/cask/cask/master/go | python

pygments-main: install-pygments

install-pygments:
	if [ ! -d pygments-main ] ; then hg clone https://bitbucket.org/leanprover/pygments-main && cd pygments-main && python setup.py build; fi

gitHeadInfo.gin:
	git log -1 --date=short \
	--pretty=format:"\usepackage[shash={%h},lhash={%H},authname={%an},authemail={%ae},authsdate={%ad},authidate={%ai},authudate={%at},commname={%an},commemail={%ae},commsdate={%ad},commidate={%ai},commudate={%at},refnames={%d}]{gitsetinfo}" HEAD >$@

test:
	for ORG in $(ORGS); do $(MKLEANBOOK_PATH)/test.sh $(LEAN_BIN) $$ORG || exit 1; done
test_js:
	for ORG in $(ORGS); do $(MKLEANBOOK_PATH)/test_js.sh $$ORG || exit 1; done

$(NAV_DATA): copy-html-assets
	echo "var lean_nav_data = [" > $(NAV_DATA)
	for i in $(HTMLS); do echo $$i; done | sed 's/\(.*\)/"\1",/' >> $(NAV_DATA)
	echo "];" >> $(NAV_DATA)

copy-html-assets:
	sed 's|COPYRIGHT_NOTICE|$(COPYRIGHT_NOTICE)|;s|AUTHORS|$(AUTHORS)|;s|TITLE|$(TITLE)|;s|COMBINED|$(COMBINED)|g' $(MKLEANBOOK_PATH)/index.html >index.html
	cp -ra $(MKLEANBOOK_PATH)/juicy-ace-editor.html ./
	cp -ra $(MKLEANBOOK_PATH)/css ./
	cp -ra $(MKLEANBOOK_PATH)/fonts ./
	cp -ra $(MKLEANBOOK_PATH)/images ./
	cp -ra $(MKLEANBOOK_PATH)/js ./

.PHONY: all copy-html-assets clean install-cask pygments-main

.DELETE_ON_ERROR:
