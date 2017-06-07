: minTen ( n -- (n>10) ) dup 10 swap >
    if
        pop 10
    then ;

100 minTen .