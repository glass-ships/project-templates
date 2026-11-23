import { useState } from "react";
import AppInfiniteScroll from "@/components/ui/AppInfiniteScroll";
import AppSection from "@/components/ui/AppSection";

const PAGE_SIZE = 5;
const TOTAL = 500;

export default function TestInfiniteScroll() {
  const [items, setItems] = useState(() => makeItems(1));
  const hasNextPage = items.length < TOTAL;

  const loadMore = () => setItems((prev) => [...prev, ...makeItems(Math.min(PAGE_SIZE, TOTAL - prev.length))]);
  return (
    <main>
      <AppSection width="full">
        <AppInfiniteScroll hasNextPage={hasNextPage} onLoadMore={loadMore}>
          <h3>Scroll down to trigger infinite scroll...</h3>
          {items.map((item) => (
            <p key={item.id} style={{ whiteSpace: "pre-line" }}>
              {item.text}
            </p>
          ))}
          {!hasNextPage && <p>End of list</p>}
        </AppInfiniteScroll>
      </AppSection>
    </main>
  );
}

type Item = { id: number; text: string };

let nextId = 0;
const makeItems = (count: number): Item[] => Array.from({ length: count }, () => ({ id: nextId++, text: pickText() }));

function pickText() {
  // pick a random text from a list of texts
  const texts = [
    'You are a worm through time. The thunder song distorts you. Happiness comes. White pearls, but yellow and red in the eye. Through a mirror, inverted is made right. Leave your insides by the door. Push the fingers through the surface into the wet. You’ve always been the new you. You want this to be true. We stand around you while you dream. You can almost hear our words but you forget. This happens more and more now. You gave us the permission in your regulations. We wait in the stains. The word that describes this is redacted. Repeat the word. The name of the sound. It resonates in your house. After the song, time for applause. We build you till nothing remains. The egg cracks and the truth will emerge out of you. You are home. You remind us of home. You’ve taken your boss with your boss with you. All hair must be eaten. Under the conceptual reality behind this reality you must want these waves to drag you away. After the song, time for applause. This cliché is death out of time, breaking the first the second the third the fourth wall, the fifth wall, floor; no floor: you fall! How do you say “insane”? Hurts to be happy. An earworm is a tune you can’t stop humming in a dream: "Baby baby baby, yeah." Just plastic. So safe and nothing to worry about. Ha ha, funny. The last egg breaks now. The hole in your room is a hole in you. You came and we let you in through the hole in you. You have always been here, the only child. A copy of a copy of a copy. Orange peel. The picture is you holding the picture. When you hear this you will know you’re in new you. You want to listen. You want to dream. You want to smile. You want to hurt. You don’t want to be.',
    "Lost on the shore\nBetween the forest and the ocean\nThe owl and the deer\nReflected in motion\nIn his room, he will hurt her\nIn hers, he is caught\nHis story ends\nHer story does not\nThis is the ritual\nTo lead you on\nYour friends will meet him\nWhen you are gone",
    "The writer of the first word\nNot the writer of the last\nWith the terror of the light\nAnd the shadow cast\nThe third eye now opened\nTo project the night\nThis is the moment\nTo write\nThis is the ritual\nTo lead you on\nYour friends will meet him\nWhen you are gone",
    "A pale balloon in the sky\nFloat and sink deeper\nNight springs when bright\nFalls for this sleeper\nThe surface disturbed\nThe reflection now a traitor\nIn the cavity of the skull\nTurned to a crater\nThis is the ritual\nTo lead you on\nYour friends will meet him\nWhen you are gone",
  ];
  return texts[Math.floor(Math.random() * texts.length)];
}
