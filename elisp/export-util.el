(require 'dash)
(require 'dash-functional)

(defun extract-code (code)
  "Given a string of code, extract the part wrapped in /*
  PARAMETERS and END */ (if any), and the part outside of that."
  (let* ((lines (s-split "\n" code))
         (begin-marker "/* PARAMETERS")
         (end-marker "END */")
         (has-markers
          (and (-contains? lines begin-marker) (-contains? lines end-marker)))
         (separated
          (cond (has-markers
                 (--split-when (or (s-equals? it begin-marker)
                                   (s-equals? it end-marker))
                               (--drop-while (not (s-equals? it begin-marker)) lines)))
                (t (list nil lines)))))
    (cons (s-join "\n" (cadr separated))
          (s-join "\n" (car separated)))))

;;(car (extract-code "foo\nbaz"))
;;(extract-code "/* PARAMETERS\nbar\nEND */\nfoo\nbaz")
(provide 'export-util)
