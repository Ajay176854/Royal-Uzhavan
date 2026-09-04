import * as React from "react"
import { useCallback, useEffect, useMemo, useRef } from "react"
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useTransform,
    type MotionValue,
} from "motion/react"
import type { Product } from "../data"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Props = {
    products: Product[]
    activeWidth?: number
    activeHeight?: number
    restWidth?: number
    restHeight?: number
    gap?: number
    radius?: number
    showArrows?: boolean
    arrowColor?: string
    arrowBackground?: string
    arrowSize?: number
    arrowPosition?: number
    autoplay?: boolean
    autoplayDirection?: "leftToRight" | "rightToLeft"
    transition?: { duration?: number; delay?: number }
    style?: React.CSSProperties
    onProductClick?: (product: Product) => void
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const GRADIENT_FALLBACKS = [
    "linear-gradient(160deg, #2d5016, #4a7c29)",
    "linear-gradient(160deg, #5c3d1e, #8b6914)",
    "linear-gradient(160deg, #1a3a2a, #2d6b4a)",
    "linear-gradient(160deg, #4a3728, #7a5a3f)",
    "linear-gradient(160deg, #3d5a1e, #6b8f3c)",
    "linear-gradient(160deg, #2a4a18, #4d7a2e)",
    "linear-gradient(160deg, #5a4020, #8a6830)",
]

const RENDER_RANGE = 6

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

type Sizing = {
    restWidth: number
    restHeight: number
    activeWidth: number
    activeHeight: number
}

function relOf(index: number, pos: number, count: number): number {
    let rel = (((index - pos) % count) + count) % count
    if (rel > count / 2) rel -= count
    return rel
}

function xForRel(rel: number, s: Sizing, gap: number): number {
    const ar = Math.abs(rel)
    const c1 = s.activeWidth / 2 + gap + s.restWidth / 2
    const pitch = s.restWidth + gap
    const mag = ar <= 1 ? ar * c1 : c1 + (ar - 1) * pitch
    return (rel < 0 ? -1 : 1) * mag
}

function blendForRel(rel: number): number {
    return Math.min(Math.abs(rel), 1)
}

// -----------------------------------------------------------------------------
// Card
// -----------------------------------------------------------------------------

function Card({
    product,
    index,
    pos,
    count,
    R,
    sizing,
    gap,
    radius,
    gradient,
    onSelect,
}: {
    key?: React.Key
    product: Product
    index: number
    pos: MotionValue<number>
    count: number
    R: number
    sizing: Sizing
    gap: number
    radius: number
    gradient: string
    onSelect: ((index: number) => void) | undefined
}) {
    const x = useTransform(pos, (p: number) =>
        xForRel(relOf(index, p, count), sizing, gap)
    )
    const opacity = useTransform(pos, (p: number) => {
        const ar = Math.abs(relOf(index, p, count))
        return ar <= R ? 1 : ar >= R + 1 ? 0 : 1 - (ar - R)
    })
    const zIndex = useTransform(pos, (p: number) =>
        Math.round(1000 - Math.abs(relOf(index, p, count)) * 100)
    )
    const width = useTransform(pos, (p: number) => {
        const a = blendForRel(relOf(index, p, count))
        return sizing.activeWidth + (sizing.restWidth - sizing.activeWidth) * a
    })
    const height = useTransform(pos, (p: number) => {
        const a = blendForRel(relOf(index, p, count))
        return (
            sizing.activeHeight + (sizing.restHeight - sizing.activeHeight) * a
        )
    })
    const borderRadius = useTransform(pos, (p: number) => {
        const a = blendForRel(relOf(index, p, count))
        const w =
            sizing.activeWidth + (sizing.restWidth - sizing.activeWidth) * a
        const h =
            sizing.activeHeight + (sizing.restHeight - sizing.activeHeight) * a
        return (Math.max(0, Math.min(20, radius)) / 20) * (Math.min(w, h) / 2)
    })
    const boxShadow = useTransform(pos, (p: number) => "none")

    // Overlay opacity: fully visible only on the active (center) card
    const overlayOpacity = useTransform(pos, (p: number) => {
        const ar = Math.abs(relOf(index, p, count))
        return ar < 0.5 ? 1 : Math.max(0, 1 - ar * 1.5)
    })

    return (
        <motion.div
            onClick={onSelect ? () => onSelect(index) : undefined}
            style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                x,
                zIndex,
                opacity,
                cursor: onSelect ? "pointer" : "default",
            }}
        >
            <motion.div
                style={{
                    x: "-50%",
                    y: "-50%",
                    width,
                    height,
                    borderRadius,
                    overflow: "hidden",
                    background: gradient,
                    boxShadow,
                    position: "relative",
                }}
            >
                {product.image && (
                    <img
                        src={product.image}
                        alt={product.name}
                        draggable={false}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            pointerEvents: "none",
                            userSelect: "none",
                        }}
                    />
                )}
                {/* Product info overlay */}
                <motion.div
                    style={{
                        opacity: overlayOpacity,
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
                        padding: "32px 20px 20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        pointerEvents: "none",
                    }}
                >
                    <span
                        style={{
                            fontFamily: "var(--font-serif, Georgia, serif)",
                            fontSize: "20px",
                            fontWeight: 600,
                            color: "#fff",
                            lineHeight: 1.2,
                            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                        }}
                    >
                        {product.name}
                    </span>
                    <span
                        style={{
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "var(--color-wabi-gold, #c8a951)",
                            textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                        }}
                    >
                        ₹{product.price}
                        {product.originalPrice && (
                            <span
                                style={{
                                    fontSize: "13px",
                                    fontWeight: 400,
                                    color: "rgba(255,255,255,0.5)",
                                    textDecoration: "line-through",
                                    marginLeft: "8px",
                                }}
                            >
                                ₹{product.originalPrice}
                            </span>
                        )}
                    </span>
                    {product.tags.length > 0 && (
                        <div style={{ display: "flex", gap: "6px", marginTop: "4px", flexWrap: "wrap" }}>
                            {product.tags.slice(0, 2).map((tag) => (
                                <span
                                    key={tag}
                                    style={{
                                        fontSize: "10px",
                                        fontWeight: 700,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        color: "#fff",
                                        background: "rgba(255,255,255,0.15)",
                                        backdropFilter: "blur(4px)",
                                        padding: "3px 10px",
                                        borderRadius: "999px",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

// -----------------------------------------------------------------------------
// ArrowButton
// -----------------------------------------------------------------------------

function ArrowButton({
    side,
    onClick,
    color,
    background,
    size,
    position,
}: {
    side: "left" | "right"
    onClick: () => void
    color: string
    background: string
    size: number
    position: number
}) {
    const isLeft = side === "left"
    const p = Math.max(0, Math.min(100, position))
    const inset = `calc((50% - ${size}px) * ${(100 - p) / 100})`
    return (
        <button
            type="button"
            aria-label={isLeft ? "Previous" : "Next"}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
                e.stopPropagation()
                onClick()
            }}
            style={{
                position: "absolute",
                top: "50%",
                [isLeft ? "left" : "right"]: inset,
                transform: "translateY(-50%)",
                width: size,
                height: size,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.15)",
                background,
                color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
                zIndex: 2000,
                boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
                WebkitTapHighlightColor: "transparent",
                transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-50%) scale(1.1)"
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.45)"
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(-50%)"
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.35)"
            }}
        >
            <svg
                width={size * 0.4}
                height={size * 0.4}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pointerEvents: "none" }}
            >
                {isLeft ? (
                    <polyline points="15 18 9 12 15 6" />
                ) : (
                    <polyline points="9 18 15 12 9 6" />
                )}
            </svg>
        </button>
    )
}

// -----------------------------------------------------------------------------
// CoverflowCarousel
// -----------------------------------------------------------------------------

const COMPONENT_DEFAULTS = {
    activeWidth: 420,
    activeHeight: 380,
    restWidth: 140,
    restHeight: 250,
    gap: 24,
    radius: 4,
    showArrows: true,
    arrowColor: "var(--color-wabi-green, #2d3b1e)",
    arrowBackground: "rgba(255,255,255,0.9)",
    arrowSize: 48,
    arrowPosition: 95,
    autoplay: false,
    autoplayDirection: "rightToLeft" as const,
    transition: {
        duration: 0.3,
        delay: 2.5,
    },
}

export default function CoverflowCarousel(props: Props) {
    const {
        products,
        activeWidth = COMPONENT_DEFAULTS.activeWidth,
        activeHeight = COMPONENT_DEFAULTS.activeHeight,
        restWidth = COMPONENT_DEFAULTS.restWidth,
        restHeight = COMPONENT_DEFAULTS.restHeight,
        gap = COMPONENT_DEFAULTS.gap,
        radius = COMPONENT_DEFAULTS.radius,
        showArrows = COMPONENT_DEFAULTS.showArrows,
        arrowColor = COMPONENT_DEFAULTS.arrowColor,
        arrowBackground = COMPONENT_DEFAULTS.arrowBackground,
        arrowSize = COMPONENT_DEFAULTS.arrowSize,
        arrowPosition = COMPONENT_DEFAULTS.arrowPosition,
        autoplay = COMPONENT_DEFAULTS.autoplay,
        autoplayDirection = COMPONENT_DEFAULTS.autoplayDirection,
        transition: transitionProp = COMPONENT_DEFAULTS.transition,
        style,
        onProductClick,
    } = props

    const prefersReducedMotion = useReducedMotion()

    const count = Math.max(1, products.length)

    const sizing: Sizing = useMemo(
        () => ({ restWidth, restHeight, activeWidth, activeHeight }),
        [restWidth, restHeight, activeWidth, activeHeight]
    )

    const moveDur =
        typeof transitionProp?.duration === "number"
            ? transitionProp.duration
            : 0.5
    const dwell =
        typeof transitionProp?.delay === "number"
            ? Math.max(0, transitionProp.delay)
            : 1.2

    const R = Math.max(1, Math.min(RENDER_RANGE, Math.floor(count / 2) - 1))

    // ---- Single rAF driver -------------------------------------------------
    const pos = useMotionValue(0)
    const targetRef = useRef(0)
    const rafRef = useRef<number | null>(null)
    const lastTRef = useRef<number | null>(null)
    const autoplayingRef = useRef(false)
    const dirRef = useRef(1)
    const dwellAccRef = useRef(0)
    const moveDurRef = useRef(moveDur)
    moveDurRef.current = moveDur
    const dwellRef = useRef(dwell)
    dwellRef.current = dwell
    const reducedRef = useRef(prefersReducedMotion)
    reducedRef.current = prefersReducedMotion

    const tick = useCallback(
        (t: number) => {
            const last = lastTRef.current ?? t
            const dt = Math.min((t - last) / 1000, 1 / 30)
            lastTRef.current = t

            const cur = pos.get()
            const diff = targetRef.current - cur
            const dur = Math.max(0.08, moveDurRef.current)
            const step = (1 / dur) * dt
            const arriving = reducedRef.current || Math.abs(diff) <= step

            if (arriving) {
                pos.set(targetRef.current)
                if (autoplayingRef.current) {
                    dwellAccRef.current += dt
                    if (dwellAccRef.current >= Math.max(0, dwellRef.current)) {
                        dwellAccRef.current = 0
                        targetRef.current += dirRef.current
                    }
                    rafRef.current = requestAnimationFrame(tick)
                    return
                }
                rafRef.current = null
                lastTRef.current = null
                return
            }

            pos.set(cur + Math.sign(diff) * step)
            rafRef.current = requestAnimationFrame(tick)
        },
        [pos]
    )

    const ensureRunning = useCallback(() => {
        if (rafRef.current == null) {
            lastTRef.current = null
            rafRef.current = requestAnimationFrame(tick)
        }
    }, [tick])

    const goNext = useCallback(() => {
        targetRef.current += 1
        ensureRunning()
    }, [ensureRunning])
    const goPrev = useCallback(() => {
        targetRef.current -= 1
        ensureRunning()
    }, [ensureRunning])
    const goTo = useCallback(
        (index: number) => {
            const cur = targetRef.current
            let d = index - cur
            d = ((d % count) + count) % count
            if (d > count / 2) d -= count
            targetRef.current = cur + d
            ensureRunning()
        },
        [ensureRunning, count]
    )

    useEffect(() => {
        return () => {
            if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }
    }, [])

    // ---- Autoplay ----------------------------------------------------------
    useEffect(() => {
        const on = autoplay && count > 1
        autoplayingRef.current = on
        if (on) {
            dirRef.current = autoplayDirection === "leftToRight" ? -1 : 1
            dwellAccRef.current = 0
            ensureRunning()
        }
        return () => {
            autoplayingRef.current = false
        }
    }, [autoplay, autoplayDirection, count, ensureRunning])

    // ---- Keyboard ----------------------------------------------------------
    const isHoveredRef = useRef(false)
    useEffect(() => {
        if (autoplay) return
        const onKey = (e: KeyboardEvent) => {
            if (!isHoveredRef.current) return
            if (e.key === "ArrowLeft") {
                e.preventDefault()
                goPrev()
            } else if (e.key === "ArrowRight") {
                e.preventDefault()
                goNext()
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [autoplay, goPrev, goNext])

    // ---- Container ---------------------------------------------------------
    const containerStyle: React.CSSProperties = {
        ...style,
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 320,
        minHeight: 240,
        overflow: "hidden",
        userSelect: "none",
        touchAction: "pan-y",
        outline: "none",
    }

    const selectable = !autoplay
    const cards = products.map((product, i) => (
        <Card
            key={product.id}
            product={product}
            index={i}
            pos={pos}
            count={count}
            R={R}
            sizing={sizing}
            gap={gap}
            radius={radius}
            gradient={GRADIENT_FALLBACKS[i % GRADIENT_FALLBACKS.length]}
            onSelect={
                selectable
                    ? (idx) => {
                        goTo(idx)
                        onProductClick?.(products[idx])
                    }
                    : undefined
            }
        />
    ))

    const arrows = showArrows && count > 1 && (
        <>
            <ArrowButton
                side="left"
                onClick={goPrev}
                color={arrowColor}
                background={arrowBackground}
                size={arrowSize}
                position={arrowPosition}
            />
            <ArrowButton
                side="right"
                onClick={goNext}
                color={arrowColor}
                background={arrowBackground}
                size={arrowSize}
                position={arrowPosition}
            />
        </>
    )

    return (
        <div
            tabIndex={0}
            onMouseEnter={() => {
                isHoveredRef.current = true
            }}
            onMouseLeave={() => {
                isHoveredRef.current = false
            }}
            onFocus={() => {
                isHoveredRef.current = true
            }}
            onBlur={() => {
                isHoveredRef.current = false
            }}
            style={containerStyle}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                    isolation: "isolate",
                    zIndex: 0,
                }}
            >
                {cards}
            </div>
            {arrows}
        </div>
    )
}
