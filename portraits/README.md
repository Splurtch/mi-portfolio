# Retratos del portfolio

- editorial.webp: retrato editorial SYNJI facilitado por el usuario, portada.
- picaro.webp: retrato pícaro facilitado por el usuario, estado inicial del laboratorio interactivo.
- expressions.webp: atlas 2×2 generado con imagegen a partir del retrato pícaro. Orden: pícaro, sorpresa, mejillas, guiño. Se recorta en canvas por cuadrante, sin descargar cuatro archivos.
- El retrato del traje beige se conserva en ../synji-hero.webp.

Los PNG originales se conservan en el dossier local 0001_Synji/new-portraits, excluido de Git. WebP mantiene dimensiones; calidad 88 para reducir transferencia.

## Retrato elástico continuo

El laboratorio conserva las imágenes originales y muestra el cuadrado completo, sin recorte `cover`. La silueta vectorial de `src/lib/portrait/silhouette.ts` se aplica durante el renderizado y también define la zona táctil; el marco queda por detrás y no recorta pelo ni hombros.

El renderizador prioritario usa una malla continua 128×128 (WebGL2, con compatibilidad WebGL1). Si el navegador no ofrece WebGL, usa una malla Canvas2D 48×48 de vértices compartidos, omitiendo las celdas totalmente transparentes. Los triángulos comparten posiciones, no son rectángulos que se desplazan por separado. Al soltar, un muelle amortiguado devuelve el retrato a su forma. La resolución se ajusta al tamaño real y hasta 2× DPR.

Se mantiene una alternativa SVG estática si falla el renderizado; los botones de gesto siguen disponibles. El modo de movimiento reducido evita deformación y transiciones. El motor deja de dibujar en reposo o fuera del capítulo y cancela el arrastre al perder foco, cambiar de tamaño o salir de escena.

Pruebas: `npm test`, `npm run lint`, `npm run build`. Durante `npm run dev`, las páginas `tests/portrait-harness.html` y `tests/portrait-benchmark.html` permiten verificar los modos y medir el coste del renderizado; no forman parte del build publicado.
