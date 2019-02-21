import { useState, useEffect } from 'react';
import { fromEvent, merge } from 'rxjs';
import { mergeMap, takeUntil, filter, map } from 'rxjs/operators';

export const useDragObservable = (element) => {
  const [drag, setDrag] = useState(null);

  useEffect(() => {
    if (!element) return;

    const start$ = merge(
      fromEvent(element, 'mousedown'),
      fromEvent(element, 'touchstart')
    );

    const move$ = merge(
      fromEvent(element, 'mousemove'),
      fromEvent(element, 'touchmove')
    );

    const end$ = merge(
      fromEvent(element, 'mouseup'),
      fromEvent(element, 'mouseleave'),
      fromEvent(element, 'touchend'),
      fromEvent(element, 'touchcancel')
    );

    const drag$ = start$.pipe(
      mergeMap(start => {

        return move$.pipe(
          map(move => {
            move.preventDefault();

            return move;
          }),
          takeUntil(end$)
        );
      })
    );

    setDrag({
      start$,
      move$,
      end$,
      drag$
    });
  }, [element]);

  return drag;
};
