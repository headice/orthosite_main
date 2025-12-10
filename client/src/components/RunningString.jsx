import React from "react";

export const RunningString = () => {
  return (
    <div className="w-full overflow-hidden bg-yellow-400 py-5 text-xs font-semibold uppercase tracking-wide text-blue-900 md:text-sm">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="pr-10">
          Скидка на ранее бронирование! ⠀⠀Количество мест ограничено! ⠀⠀
          Скидка на ранее бронирование! ⠀⠀Количество мест ограничено!
        </span>

        <span className="pr-10">
          Скидка на ранее бронирование! ⠀⠀Количество мест ограничено! ⠀⠀
          Скидка на ранее бронирование! ⠀⠀Количество мест ограничено!
        </span>
      </div>
    </div>
  );
};
