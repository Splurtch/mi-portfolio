/**
 * Vector silhouette measured in the original 1254px square portrait. Keeping
 * this as geometry preserves the original photo, rather than inventing detail
 * or baking a small, enlarged cut-out. Shared by WebGL, hit area and fallback.
 */
export const PORTRAIT_SILHOUETTE = `M 0 1000
L 0 962 Q 14 927 22 894 Q 35 858 43 822 Q 55 776 81 762
Q 116 744 162 727 Q 223 706 276 687 Q 322 667 344 642
Q 359 621 361 608 Q 349 583 357 567 L 377 552
Q 376 525 370 498 Q 364 468 357 437
Q 338 434 332 418 Q 323 396 329 359 Q 330 329 339 315
Q 350 304 365 321 Q 366 297 373 272 Q 379 245 382 225
Q 389 207 389 190 Q 397 174 403 159 Q 415 132 437 114
Q 452 99 475 90 L 486 80 L 505 77 L 515 67 L 532 68
L 545 60 L 560 64 L 578 57 L 592 61 L 608 59 L 625 65
L 641 65 Q 675 76 692 100 Q 713 126 709 159
Q 711 176 704 196 Q 702 226 695 252 Q 692 281 684 308
L 682 364 Q 693 355 698 367 Q 708 391 693 426
Q 681 461 667 470 Q 655 478 645 466
Q 637 507 631 537 Q 646 551 636 574 L 650 602
Q 674 626 698 645 Q 747 667 794 684 Q 850 706 895 712
Q 941 722 960 752 Q 977 776 969 812 Q 976 858 976 900
Q 985 948 976 1000 Z`;

export function createPortraitMask() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1254;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Portrait mask unavailable');
  context.scale(1.254, 1.254);
  context.fillStyle = '#fff';
  context.fill(new Path2D(PORTRAIT_SILHOUETTE));
  return canvas;
}
