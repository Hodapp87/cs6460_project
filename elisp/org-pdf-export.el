(require 'f)
(require 'cl)
(setq working-dir (f-dirname (f-this-file)))
(add-to-list 'load-path working-dir)
(setq make-backup-files nil)
(require 'org)
(require 'ox)
(require 'export-util)
(setq org-confirm-babel-evaluate nil)

;;; XeLaTeX customisations
;; remove "inputenc" from default packages as it clashes with xelatex
;; (setf org-latex-default-packages-alist
;;       (remove '("AUTO" "inputenc" t) org-latex-default-packages-alist))

(setq org-latex-default-packages-alist
      '(("T1" "fontenc" t)
        ("" "fixltx2e" nil)
        ("" "graphicx" t)
        ("" "longtable" nil)
        ("" "float" nil)
        ("" "wrapfig" nil)
        ("" "rotating" nil)
        ("normalem" "ulem" t)
        ("" "amsmath" t)
        ("" "textcomp" t)
        ("" "marvosym" t)
        ("" "wasysym" t)
        ("" "amssymb" t)
        ("" "imakeidx" nil)
        ("" "hyperref" nil)
        "\\tolerance=1000"))

(setq org-latex-listings 'minted)
(setq org-export-with-smart-quotes t)
(add-to-list 'org-export-smart-quotes-alist
'("en"
  (primary-opening :utf-8 "“" :html "&ldquo;" :latex "``" :texinfo "``")
  (primary-closing :utf-8 "”" :html "&rdquo;" :latex "''" :texinfo "''")
  (secondary-opening :utf-8 "‘" :html "&lsquo;" :latex "`" :texinfo "`")
  (secondary-closing :utf-8 "’" :html "&rsquo;" :latex "'" :texinfo "'")
  (apostrophe :utf-8 "’" :html "&rsquo;")))

;; Header.tex explicitly loads all necessary packages.
(make-local-variable 'org-latex-default-packages-alist)
(setf org-latex-default-packages-alist nil)
(setq org-export-latex-listings 'minted)
(setq org-latex-minted-options
      '(("frame" "lines")
        ("fontsize" "\\scriptsize")))
(setq-default indent-tabs-mode nil)

(defun lean-filter-latex-link (text backend info)
  (when (eq backend 'latex)
    (cond ((string-match
            (rx "\\hyperref"
                "\["
                "sec-"
                (group (one-or-more (in digit "-")))
                "\]"
                "\{" (one-or-more (in alnum " ")) "\}"
                (group (zero-or-more " "))
                ) text)
           (let* ((sec-number-org (match-string 1 text))
                  (sec-number (s-replace-all
                               '(("-" . "."))
                               sec-number-org))
                  (spaces (match-string 2 text)))
             (s-concat "\\hyperref[sec-"
                       sec-number-org
                       "]{"
                       sec-number
                       "}"
                       spaces))))))

(eval-after-load "ox-latex"
  '(progn
     (add-to-list 'org-export-filter-link-functions 'lean-filter-latex-link)
     (defun lean-extract-core-code (code-info)
       "Given a code-info which is a cons cell whose car element is source code,
Extract the core code between -- BEGIN and -- END lines"
       (let* ((code (car code-info))
              (rest (cdr code-info))
              (core-lines (car (lean-extract-code code))))
         (cons core-lines rest)))
     (defun org-latex-src-block (src-block contents info)
       "Transcode a SRC-BLOCK element from Org to LaTeX.
CONTENTS holds the contents of the item.  INFO is a plist holding
contextual information."
       (when (org-string-nw-p (org-element-property :value src-block))
         (let* ((org-lang (org-element-property :language src-block))
                (lang (if (string= org-lang "lean_text") "lean" org-lang))
                (caption (org-element-property :caption src-block))
                (label (org-element-property :name src-block))
                (custom-env (and lang
                                 (cadr (assq (intern lang)
                                             org-latex-custom-lang-environments))))
                (num-start (case (org-element-property :number-lines src-block)
                             (continued (org-export-get-loc src-block info))
                             (new 0)))
                (retain-labels (org-element-property :retain-labels src-block))
                (attributes (org-export-read-attribute :attr_latex src-block))
                (float (plist-get attributes :float)))
           (cond
            ;; Case 1.  No source fontification.
            ((not org-latex-listings)
             (let* ((caption-str (org-latex--caption/label-string src-block info))
                    (float-env
                     (cond ((and (not float) (plist-member attributes :float)) "%s")
                           ((string= "multicolumn" float)
                            (format "\\begin{figure*}[%s]\n%%s%s\n\\end{figure*}"
                                    org-latex-default-figure-position
                                    caption-str))
                           ((or caption float)
                            (format "\\begin{figure}[H]\n%%s%s\n\\end{figure}"
                                    caption-str))
                           (t "%s"))))
               (format
                float-env
                (concat (format "\\begin{verbatim}\n%s\\end{verbatim}"
                                (org-export-format-code-default src-block info))))))
            ;; Case 2.  Custom environment.
            (custom-env (format "\\begin{%s}\n%s\\end{%s}\n"
                                custom-env
                                (org-export-format-code-default src-block info)
                                custom-env))
            ;; Case 3.  Use minted package.
            ((eq org-latex-listings 'minted)
             (let* ((caption-str (org-latex--caption/label-string src-block info))
                    (float-env
                     (cond ((and (not float) (plist-member attributes :float)) "%s")
                           ((string= "multicolumn" float)
                            (format "\\begin{listing*}\n%%s\n%s\\end{listing*}"
                                    caption-str))
                           ((or caption float)
                            (format "\\begin{listing}[H]\n%%s\n%s\\end{listing}"
                                    caption-str))
                           (t "%s")))
                    (body
                     (format
                      "\\begin{minted}[%s]{%s}\n%s\\end{minted}"
                      ;; Options.
                      (org-latex--make-option-string
                       (if (or (not num-start)
                               (assoc "linenos" org-latex-minted-options))
                           org-latex-minted-options
                         (append
                          `(("linenos")
                            ("firstnumber" ,(number-to-string (1+ num-start))))
                          org-latex-minted-options)))
                      ;; Language.
                      (or (cadr (assq (intern lang) org-latex-minted-langs))
                          (downcase lang))
                      ;; Source code.
                      ;; Soonho Kong: call lean-extract-core-code to
                      ;; extract the lines between begin and end
                      (let* ((code-info (lean-extract-core-code (org-export-unravel-code src-block)))
                             (max-width
                              (apply 'max
                                     (mapcar 'length
                                             (org-split-string (car code-info)
                                                               "\n")))))
                        (org-export-format-code
                         (car code-info)
                         (lambda (loc num ref)
                           (concat
                            loc
                            (when ref
                              ;; Ensure references are flushed to the right,
                              ;; separated with 6 spaces from the widest line
                              ;; of code.
                              (concat (make-string (+ (- max-width (length loc)) 6)
                                                   ?\s)
                                      (format "(%s)" ref)))))
                         nil (and retain-labels (cdr code-info)))))))
               ;; Return value.
               (format float-env body)))
            ;; Case 4.  Use listings package.
            (t
             (let ((lst-lang
                    (or (cadr (assq (intern lang) org-latex-listings-langs)) lang))
                   (caption-str
                    (when caption
                      (let ((main (org-export-get-caption src-block))
                            (secondary (org-export-get-caption src-block t)))
                        (if (not secondary)
                            (format "{%s}" (org-export-data main info))
                          (format "{[%s]%s}"
                                  (org-export-data secondary info)
                                  (org-export-data main info)))))))
               (concat
                ;; Options.
                (format
                 "\\lstset{%s}\n"
                 (org-latex--make-option-string
                  (append
                   org-latex-listings-options
                   (cond
                    ((and (not float) (plist-member attributes :float)) nil)
                    ((string= "multicolumn" float) '(("float" "*")))
                    ((and float (not (assoc "float" org-latex-listings-options)))
                     `(("float" ,org-latex-default-figure-position))))
                   `(("language" ,lst-lang))
                   (if label `(("label" ,label)) '(("label" " ")))
                   (if caption-str `(("caption" ,caption-str)) '(("caption" " ")))
                   (cond ((assoc "numbers" org-latex-listings-options) nil)
                         ((not num-start) '(("numbers" "none")))
                         ((zerop num-start) '(("numbers" "left")))
                         (t `(("numbers" "left")
                              ("firstnumber"
                               ,(number-to-string (1+ num-start)))))))))
                ;; Source code.
                (format
                 "\\begin{lstlisting}\n%s\\end{lstlisting}"
                 (let* ((code-info (org-export-unravel-code src-block))
                        (max-width
                         (apply 'max
                                (mapcar 'length
                                        (org-split-string (car code-info) "\n")))))
                   (org-export-format-code
                    (car code-info)
                    (lambda (loc num ref)
                      (concat
                       loc
                       (when ref
                         ;; Ensure references are flushed to the right,
                         ;; separated with 6 spaces from the widest line of
                         ;; code
                         (concat (make-string (+ (- max-width (length loc)) 6) ? )
                                 (format "(%s)" ref)))))
                    nil (and retain-labels (cdr code-info))))))))))))
     ))
