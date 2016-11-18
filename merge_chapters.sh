#!/usr/bin/env bash
#
# Copyright (c) 2014 Microsoft Corporation. All rights reserved.
# Released under Apache 2.0 license as described in the file LICENSE.
#
# Author: Soonho Kong
#
# Collect 01_xxx.org, 02_xxx.org, ... files and merge them into tutorial.org file
#
# Collect Main Chapters

(

first=1
for CHAPTER in $@; do
    [[ "${CHAPTER}" = [0-9]* ]] || continue
    if [[ $first -eq 1 ]]; then
        first=0
        echo "$CHAPTER" >&2
        cat ${CHAPTER}
    else
        START_LINE=`grep -n '^\* ' ${CHAPTER} | cut -d ':' -f 1`
        echo "$CHAPTER : +${START_LINE}" >&2
        tail -n +${START_LINE} -- ${CHAPTER}
    fi
    echo
done

# Collect Appendices
echo "#+BEGIN_EXPORT LATEX"
echo "\appendix"
echo "#+END_EXPORT"

for APPENDIX in $@; do
    [[ "${APPENDIX}" = A* ]] || continue
    START_LINE=`grep -n '^\* ' ${APPENDIX} | cut -d ':' -f 1`
    echo "$APPENDIX : +${START_LINE}" >&2
    tail -n +${START_LINE} -- ${APPENDIX}
    echo
done


# Replace inter-file links to inner-file links
#
# Example:
#
#     In Section [[file:05_Interacting_with_Lean.org::Notation_Overloads_and_Coercions][Notations, Overloads, and Coercions]], we discussed coercions
#
# =>
#
#     In Section [[Notation_Overloads_and_Coercions][Notations, Overloads, and Coercions]], we discussed coercions
) | sed -e "s/file:[0-9][0-9]_[^:]*.org:://g"
