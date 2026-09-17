"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, MapPin, RotateCcw, Star, X } from "@/components/ui/icons";
import { Progress } from "@/components/ui/progress";
import { UniversityImage } from "@/components/ui/university-image";
import type { University } from "@/types";

const SWIPE_THRESHOLD = 80;
const VELOCITY_THRESHOLD = 500;
const MAX_UNIVERSITIES = 15;

interface UniversitySwiperProps {
  universities: University[];
  programsByUniversity?: Record<string, string[]>;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function UniversitySwiper({ universities, programsByUniversity }: UniversitySwiperProps) {
  const [deck, setDeck] = useState<University[]>([]);
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<University[]>([]);
  const [dragX, setDragX] = useState(0);
  const [animating, setAnimating] = useState(false);
  const busyRef = useRef(false);

  useEffect(() => {
    setDeck(shuffle(universities).slice(0, MAX_UNIVERSITIES));
  }, [universities]);

  const total = deck.length;
  const current = deck[index];
  const finished = total > 0 && index >= total;

  const advance = useCallback(
    (dir: "left" | "right") => {
      if (busyRef.current || finished || !current) return;
      busyRef.current = true;
      setAnimating(true);

      if (dir === "right") setLiked((list) => [...list, current]);
      setIndex((i) => i + 1);
      setDragX(0);

      setTimeout(() => {
        busyRef.current = false;
        setAnimating(false);
      }, 300);
    },
    [finished, current],
  );

  const restart = useCallback(() => {
    setDeck(shuffle(universities).slice(0, MAX_UNIVERSITIES));
    setIndex(0);
    setLiked([]);
    setDragX(0);
    busyRef.current = false;
    setAnimating(false);
  }, [universities]);

  if (!deck.length) {
    return <p className="text-muted py-12 text-center text-sm">Загрузка вузов…</p>;
  }

  if (finished) {
    return (
      <div className="mt-8">
        <Card className="p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight">Ваши результаты</h2>
          <p className="text-muted mt-2 text-sm">
            {liked.length > 0
              ? `Вы выбрали ${liked.length} из ${total} вузов.`
              : `Вы не выбрали ни одного вуза из ${total}.`}
          </p>

          {liked.length > 0 ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-border text-muted border-b">
                    <th className="pr-4 pb-2 font-medium">#</th>
                    <th className="pr-4 pb-2 font-medium">Вуз</th>
                    <th className="pr-4 pb-2 font-medium">Город</th>
                    <th className="pb-2 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {liked.map((uni, i) => (
                    <tr key={uni.id} className="border-border/50 border-b last:border-0">
                      <td className="text-muted py-3 pr-4">{i + 1}</td>
                      <td className="py-3 pr-4">
                        <p className="font-medium">{uni.shortName}</p>
                        <p className="text-muted mt-0.5 text-xs">{uni.name}</p>
                      </td>
                      <td className="text-muted py-3 pr-4">{uni.city}</td>
                      <td className="py-3">
                        <Link
                          href={`/universities/${uni.slug}`}
                          className="text-brand-600 hover:text-brand-500 dark:text-brand-400 text-sm font-medium hover:underline"
                        >
                          Страница вуза →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          <Button onClick={restart} variant="secondary" className="mt-6">
            <RotateCcw className="size-4" />
            Пройти ещё раз
          </Button>
        </Card>
      </div>
    );
  }

  const behind = deck.slice(index + 1, index + 3);

  return (
    <div className="mt-8">
      {/* Progress */}
      <div className="mb-6 flex items-center gap-4">
        <span className="text-muted shrink-0 text-sm">
          <span className="text-foreground font-medium">{index + 1}</span> / {total}
        </span>
        <Progress value={index + 1} max={total} className="flex-1" />
        <Badge variant="success" className="shrink-0">
          <Heart className="size-3 fill-current" />
          <span className="ml-1">{liked.length}</span>
        </Badge>
      </div>

      {/* Deck */}
      <div className="relative mx-auto max-w-sm sm:max-w-md" style={{ minHeight: 340 }}>
        {/* Background stack cards */}
        {[...behind].reverse().map((uni, raw) => {
          const depth = behind.length - raw;
          return (
            <div
              key={`bg-${uni.id}`}
              className="absolute inset-0 rounded-3xl border border-white/40 bg-white/60 dark:border-white/10 dark:bg-neutral-900/50"
              style={{
                transform: `scale(${1 - depth * 0.04}) translateY(${depth * 10}px)`,
                zIndex: 10 - depth,
              }}
            />
          );
        })}

        {/* Top interactive card */}
        <AnimatePresence mode="popLayout" initial={false}>
          {current ? (
            <motion.div
              key={current.id}
              initial={{ scale: 0.95, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDrag={(_, info) => setDragX(info.offset.x)}
              onDragEnd={(_, info) => {
                setDragX(0);
                const vx = info.velocity.x;
                if (info.offset.x > SWIPE_THRESHOLD || vx > VELOCITY_THRESHOLD) {
                  advance("right");
                } else if (info.offset.x < -SWIPE_THRESHOLD || vx < -VELOCITY_THRESHOLD) {
                  advance("left");
                }
              }}
              className="relative z-30 cursor-grab active:cursor-grabbing"
              style={{ touchAction: "pan-y" }}
            >
              <SwipeCard
                university={current}
                dragX={dragX}
                directions={programsByUniversity?.[current.id] ?? []}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => advance("left")}
          disabled={animating}
          className="group border-border bg-surface flex size-14 cursor-pointer items-center justify-center rounded-full border shadow-sm transition-all hover:border-rose-400 hover:bg-rose-50 disabled:opacity-40 dark:hover:bg-rose-950/30"
          aria-label="Не нравится"
        >
          <X className="size-6 text-rose-500 transition-transform group-hover:scale-110" />
        </button>

        <button
          type="button"
          onClick={() => advance("right")}
          disabled={animating}
          className="group border-border bg-surface flex size-14 cursor-pointer items-center justify-center rounded-full border shadow-sm transition-all hover:border-emerald-400 hover:bg-emerald-50 disabled:opacity-40 dark:hover:bg-emerald-950/30"
          aria-label="Нравится"
        >
          <Heart className="size-6 fill-emerald-500 text-emerald-500 transition-transform group-hover:scale-110" />
        </button>
      </div>

      <p className="text-muted mt-4 text-center text-xs">Листайте карточки или нажимайте кнопки</p>
    </div>
  );
}

/* ---------- Single university card ---------- */

function SwipeCard({
  university,
  dragX,
  directions,
}: {
  university: University;
  dragX: number;
  directions: string[];
}) {
  const likeOpacity = Math.min(Math.max(dragX / 80, 0), 1);
  const nopeOpacity = Math.min(Math.max(-dragX / 80, 0), 1);

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 sm:h-56">
        <UniversityImage university={university} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {/* Rating pill */}
        <div className="text-foreground absolute top-3 right-3 flex items-center gap-1 rounded-full border border-white/40 bg-white/85 px-2.5 py-1 text-xs font-semibold shadow-lg backdrop-blur-md">
          <Star className="size-3.5 fill-amber-500 text-amber-500" />
          {university.rating.toFixed(1)}
        </div>

        {/* Drag labels */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ opacity: likeOpacity }}
        >
          <span className="-rotate-12 rounded-xl border-4 border-emerald-400 bg-emerald-400/20 px-6 py-2 text-2xl font-bold text-emerald-600 backdrop-blur-sm">
            Нравится
          </span>
        </div>
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ opacity: nopeOpacity }}
        >
          <span className="rotate-12 rounded-xl border-4 border-rose-400 bg-rose-400/20 px-6 py-2 text-2xl font-bold text-rose-600 backdrop-blur-sm">
            Не нравится
          </span>
        </div>

        <div className="absolute right-0 bottom-3 left-4">
          <p className="text-lg font-bold tracking-tight text-white drop-shadow-md">
            {university.shortName}
          </p>
          <p className="flex items-center gap-1 text-xs font-medium text-white/85">
            <MapPin className="size-3.5" />
            {university.city}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-muted line-clamp-3 text-sm leading-relaxed">
          {university.about || "Описание отсутствует."}
        </p>
        {directions.length > 0 ? (
          <div className="mt-4">
            <p className="text-muted text-xs font-medium tracking-wide uppercase">
              Направления в вузе
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {directions.slice(0, 4).map((name) => (
                <Badge key={name} variant="outline">
                  {name}
                </Badge>
              ))}
            </div>
            {directions.length > 4 ? (
              <p className="text-muted mt-2 text-xs">и ещё {directions.length - 4} направлений</p>
            ) : null}
          </div>
        ) : null}
        {university.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {university.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="neutral">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
