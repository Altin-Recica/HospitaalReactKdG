import {Kamer} from "../../model/Kamer.ts";

interface PlanViewProps {
    kamers: Kamer[];
}

export const PlanView = ({ kamers }: PlanViewProps) => {
    const leftRooms = kamers.filter(k => k.kamernummer % 2 === 0);
    const rightRooms = kamers.filter(k => k.kamernummer % 2 !== 0);

    const viewportWidth = window.innerWidth + 10;
    const roomHeight = viewportWidth < 768 ? 60 : 100;
    const roomWidth = viewportWidth < 768 ? 100 : 200;
    const hallwayWidth = viewportWidth < 768 ? 100 : 200;

    const maxRooms = Math.max(leftRooms.length, rightRooms.length);
    const totalHeight = (maxRooms * (roomHeight + 20)) + 100;
    const viewBoxWidth = viewportWidth < 768 ? 500 : 1000;

    const renderRooms = (rooms: Kamer[], xPos: number) => {
        return rooms.map((room, index) => {
            const yPos = index * (roomHeight + 20) + 20;

            return (
                <g key={room.id}>
                    <rect
                        x={xPos}
                        y={yPos}
                        width={roomWidth}
                        height={roomHeight + (room.type === 'luxe' ? 10 : 0)}
                        fill={room.status === 'Beschikbaar' ? '#00ff1e' : '#ff0000'}
                        stroke="#000"
                        strokeWidth="1"
                    />
                    <text
                        x={xPos + roomWidth / 2}
                        y={yPos + roomHeight / 2}
                        textAnchor="middle"
                        className="text-xs md:text-sm font-medium"
                    >
                        <tspan x={xPos + roomWidth / 2} dy="-1em">Kamer</tspan>
                        <tspan x={xPos + roomWidth / 2} dy="1.2em">{room.kamernummer}</tspan>
                        <tspan x={xPos + roomWidth / 2} dy="1.2em">{room.type === 'basis' ? "Basis" : "Luxe"}</tspan>
                    </text>
                </g>
            );
        });
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4">
            <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                <svg
                    viewBox={`0 0 ${viewBoxWidth} ${totalHeight}`}
                    className="absolute inset-0 w-full h-full border border-gray-200"
                >
                    {/* Hallway */}
                    <rect
                        x={(viewBoxWidth - hallwayWidth) / 2}
                        y="0"
                        width={hallwayWidth}
                        height={totalHeight}
                        fill="#f5f5f5"
                    />
                    <text
                        x={viewBoxWidth / 2}
                        y={totalHeight / 2}
                        textAnchor="middle"
                        className="text-lg font-medium"
                    >
                        Hallway
                    </text>

                    {renderRooms(leftRooms, (viewBoxWidth - hallwayWidth) / 2 - roomWidth)}
                    {renderRooms(rightRooms, (viewBoxWidth + hallwayWidth) / 2)}
                </svg>
            </div>
        </div>
    );
};