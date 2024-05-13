import type { Card } from "@db/schema";
import { ImageResponse } from "@vercel/og";

export function cardImage(card: Card) {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <img
                    style={{
                        borderRadius: "10px",
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                        position: "absolute",
                        boxShadow: "inset 0px 0px 5px 5px rgba(0, 0, 0, 0.2)",
                    }}
                    height={800}
                    width={700}
                    src={`https://r2.dankdeck.xyz/${card.meme.shortId}.png`}
                />
                <div tw="bg-black text-white w-full mb-auto text-2xl">
                    DankDeck.xyz
                </div>
                <div tw="bg-gray-800/70 text-2xl mt-auto text-right w-full text-white flex p-2 py-0.5">
                    <div tw="text-lime-500 flex text-xl font-semibold my-auto pr-2">
                        #{card.number}
                    </div>   {card.meme.name}
                </div>
            </div>
        ),
        {

            width: 700,
            height: 800,
        },
    );
}