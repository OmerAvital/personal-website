import type { PropsOf } from '@builder.io/qwik';
import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { mix, interpolate, easeIn } from 'popmotion';
import type { ExtendProps } from '~/types/extend-props';

export type CanvasDotsProps = ExtendProps<
  PropsOf<'canvas'>,
  {
    dotDistance?: number;
    dotSize?: number;
    dotOpacity?: number;
    lineWidth?: number;
    lineOpacity?: number;
    appearanceDuration?: number;
  },
  'ref' | 'width' | 'height' | 'class'
>;

const SIZE_MULT = 2;

export const CanvasDots = component$<CanvasDotsProps>(
  ({
    dotDistance = 50,
    dotSize = 1,
    dotOpacity = 0.2,
    lineWidth = 1,
    lineOpacity = 0.1,
    appearanceDuration = 4000,
    style,
    ...props
  }) => {
    const windowSize = useSignal({ width: 0, height: 0 });
    const ref = useSignal<HTMLCanvasElement>();
    const startTime = useSignal(NaN);

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track, cleanup }) => {
      const ctx = track(() => ref.value?.getContext('2d'));
      if (!ctx) {
        return;
      }

      const screen = {
        scrollX: 0,
        scrollY: 0,
        mouseX: NaN,
        mouseY: NaN,
      };

      const onScroll = () => {
        screen.scrollY = window.scrollY;
        screen.scrollX = window.scrollX;
      };
      const onResize = () => {
        windowSize.value = {
          width: window.innerWidth,
          height: window.innerHeight,
        };
      };
      document.addEventListener('scroll', onScroll);
      window.addEventListener('resize', onResize);
      onScroll();
      onResize();

      const darkModeMatchMedia = window.matchMedia(
        '(prefers-color-scheme: dark)',
      );
      let darkMode = darkModeMatchMedia.matches;

      let requestAnimationFrameId = 0;
      const offset = { x: 0, y: 0 };
      const w = track(() => windowSize.value.width * SIZE_MULT);
      const h = track(() => windowSize.value.height * SIZE_MULT);
      const ds = track(() => dotSize * SIZE_MULT);
      const dd = track(() => dotDistance * SIZE_MULT);

      darkModeMatchMedia.onchange = (ev) => {
        darkMode = ev.matches;
      };

      if (isNaN(startTime.value)) {
        startTime.value = performance.now();
      }

      const render = () => {
        ctx.clearRect(0, 0, w, h);

        const lightness = darkMode ? 60 : 30;
        ctx.fillStyle = `hsl(0 0% ${lightness}% / ${dotOpacity})`;
        ctx.strokeStyle = `hsl(0 0% ${lightness}% / ${lineOpacity})`;
        ctx.lineWidth = lineWidth;

        offset.x = (screen.scrollX / 2) * SIZE_MULT;
        offset.y = (screen.scrollY / 2) * SIZE_MULT;

        const maxY = document.documentElement.scrollHeight * SIZE_MULT;
        const maxX = document.documentElement.scrollWidth * SIZE_MULT;

        const mapLength = interpolate([0, 1], [0, 1], { ease: easeIn });
        const mapDelayY = interpolate([0, maxY], [0, appearanceDuration / 5]);
        const mapDelayX = interpolate(
          [0, maxX / 2, maxX],
          [appearanceDuration / 5, 0, appearanceDuration / 5],
        );

        for (let y = dd / 2; y < maxY; y += dd) {
          if (lineWidth > 0 && lineOpacity > 0) {
            const percentShownY = mapLength(
              (performance.now() - startTime.value - mapDelayY(y)) /
                (appearanceDuration / 3),
            );
            ctx.save();
            ctx.strokeStyle = `hsl(0 0% ${lightness}% / ${
              lineOpacity + mix(0.5, 0, percentShownY)
            })`;
            ctx.moveTo(0, y - offset.y);
            ctx.lineTo((w + offset.x) * percentShownY, y - offset.y);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
          }

          for (let x = dd / 2; x < maxX; x += dd) {
            if (y === dd / 2 && lineWidth > 0 && lineOpacity > 0) {
              const percentShownX = mapLength(
                (performance.now() - startTime.value - mapDelayX(x)) /
                  (appearanceDuration / 3),
              );
              ctx.save();
              ctx.strokeStyle = `hsl(0 0% ${lightness}% / ${
                lineOpacity + mix(0.5, 0, percentShownX)
              })`;
              ctx.beginPath();
              ctx.moveTo(x - offset.x, 0);
              ctx.lineTo(x - offset.x, (h + offset.y) * percentShownX);
              ctx.stroke();
              ctx.closePath();
              ctx.restore();
            }

            ctx.beginPath();
            ctx.ellipse(x - offset.x, y - offset.y, ds, ds, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
          }
        }

        requestAnimationFrameId = requestAnimationFrame(render);
      };

      render();

      cleanup(() => {
        cancelAnimationFrame(requestAnimationFrameId);
        document.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
      });
    });

    return (
      <canvas
        {...props}
        width={windowSize.value.width * SIZE_MULT}
        height={windowSize.value.height * SIZE_MULT}
        ref={ref}
        class="fixed left-0 top-0 -z-10 h-full w-full"
        style={
          typeof style === 'string'
            ? `${style}; width: ${windowSize.value.width}px; height: ${windowSize.value.height}px`
            : {
                ...style,
                width: `${windowSize.value.width}px`,
                height: `${windowSize.value.height}px`,
              }
        }
      >
        CanvasDots component works!
      </canvas>
    );
  },
);
