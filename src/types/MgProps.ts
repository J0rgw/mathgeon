import { ReactNode } from "react"
import { MgDifficulty } from "./MgDifficulty"

export type MgChildrenProps = {
    children: ReactNode
}

export type MgPlayProps = {
    dungeon: string,
    dungeonBackgroundClass: string,
    dungeonDisplayName: string,
    dungeonDifficulties: MgDifficulty[]
}

export type MgPanelProps = {
    children: ReactNode,
    large?: boolean,
    smaller?: boolean
}

export type MgMenuElementProps = {
    children: ReactNode,
    to: string,
}