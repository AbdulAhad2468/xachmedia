"use client";

import { useState } from "react";
import styles from "./StudioConcepts.module.css";

const concepts = [
  {
    id: "nura", type: "Social", brand: "NŪRA", industry: "Skincare & everyday rituals",
    title: <>Make room<br />for your glow.</>, kicker: "A LITTLE CARE. A LOT OF YOU.",
    name: "A daily ritual, beautifully told.", note: "Good skin days start with you.",
    description: "A warm, tactile social world that makes an everyday product feel personal.",
    direction: "Soft light, sculptural product scenes, and a voice that feels like a friend. The product stays at the centre of the story.",
    formats: ["Product-led social posts", "Routine reel storyboard", "Launch story sequence"],
    service: "Social & content direction",
  },
  {
    id: "offscript", type: "Brand", brand: "OFFSCRIPT", industry: "Independent fashion & culture",
    title: <>Wear your<br />point of view.</>, kicker: "LESS EXPECTED. MORE YOU.",
    name: "An identity with something to say.", note: "Made for your own kind of everyday.",
    description: "An expressive brand direction for people who set their own dress code.",
    direction: "Electric colour, oversized type, and a flexible editorial system. A distinct point of view across the profile, the feed, and the next drop.",
    formats: ["Visual identity direction", "Editorial carousel system", "Collection launch stories"],
    service: "Brand & online presence",
  },
  {
    id: "xach", type: "Motion", brand: "XACH MEDIA", industry: "Our own brand, in motion",
    title: <>Attention is<br />just the start.</>, kicker: "TURN ATTENTION INTO CONNECTION.",
    name: "A first look. A lasting connection.", note: "Strategy. Story. Something that stays.",
    description: "Our studio’s purple signature, shaped into a campaign with movement and meaning.",
    direction: "A dimensional X, light in motion, and purposeful pacing. Designed as a reel opening that leads from a striking first frame to a clear brand story.",
    formats: ["Brand reveal storyboard", "Reel opening direction", "Animated social identity"],
    service: "Motion & creative direction",
  },
];

function ConceptArtwork({ concept }) {
  return <div className={`${styles.poster} ${styles[concept.id]}`}>
    <div className={styles.posterHeader}><strong>{concept.brand}</strong><span>ORIGINAL<br />STUDIO CONCEPT</span></div>
    <div className={styles.posterWords}><span>{concept.kicker}</span><h3>{concept.title}</h3></div>
    <div className={styles.artwork} aria-hidden="true">
      {concept.id === "nura" && <><div className={styles.sunDisc} /><div className={styles.productShadow} /><div className={styles.jar}><span>NŪRA<small>DAILY SOFT<br />FACE CREAM</small></span></div><div className={styles.bottle}><div className={styles.bottleCap} /><span>NŪRA<small>THE EVERYDAY<br />GLOW SERUM</small><i>30 ML / A LITTLE RITUAL</i></span></div><div className={styles.productOrbit} /></>}
      {concept.id === "offscript" && <><div className={styles.printGrid} /><div className={styles.editorialSheet}><span>YOUR OWN<br /><b>KIND.</b></span><small>NO SCRIPT REQUIRED.</small></div><div className={styles.chromeLoop} /><div className={styles.editionTag}>OFF<br />SCRIPT<span>INDEPENDENT BY DESIGN</span></div></>}
      {concept.id === "xach" && <><div className={styles.lightTrack} /><div className={styles.glassDisc} /><div className={styles.dimensionalX}><i /><i /></div><div className={styles.connectionOrbit} /><span className={styles.spark}>✳</span></>}
    </div>
    <div className={styles.posterFooter}><span>{concept.note}</span><span aria-hidden="true">✳</span></div>
  </div>;
}

export default function StudioConcepts() {
  const [filter, setFilter] = useState("All concepts");
  const visibleCount = filter === "All concepts" ? concepts.length : concepts.filter(concept => concept.type === filter).length;
  return <section className={`creative-section section ${styles.section}`} id="creative" aria-labelledby="creative-heading">
    <div className="container">
      <div className={`section-heading ${styles.heading}`} data-reveal><div><span className="eyebrow">THE XACH IDEA LAB</span><h2 id="creative-heading">Different worlds.<br /><span>One clear point of view.</span></h2></div><p>From the first frame to the full brand story. A few original directions from our studio, made to show what’s possible.</p></div>
      <div className={styles.toolbar}><span className={styles.collectionLabel}>CREATIVE DIRECTIONS / STUDIO EDITION</span><div className={styles.filters} role="group" aria-label="Filter studio concepts">{["All concepts", "Social", "Brand", "Motion"].map(value => <button type="button" key={value} aria-pressed={value === filter} onClick={() => setFilter(value)}>{value}</button>)}</div></div>
      <p className="sr-only" role="status">{visibleCount} {visibleCount === 1 ? "concept" : "concepts"} shown.</p>
      <div className={`${styles.gallery}${filter !== "All concepts" ? ` ${styles.filtered}` : ""}`}>
        {concepts.map(concept => <article className={styles.card} key={concept.id} hidden={filter !== "All concepts" && filter !== concept.type} data-motion-region aria-labelledby={`concept-${concept.id}`}>
          <ConceptArtwork concept={concept} />
          <div className={styles.caption}><div className={styles.meta}><span>{concept.industry}</span><span>{concept.type}</span></div><h3 id={`concept-${concept.id}`}>{concept.name}</h3><p>{concept.description}</p>
            <details className={styles.details}><summary>Explore the direction<span aria-hidden="true" /></summary><div className={styles.detailsContent}><p>{concept.direction}</p><span className={styles.formatsLabel}>THE CREATIVE MIX</span><ul>{concept.formats.map(format => <li key={format}>{format}</li>)}</ul><span className={styles.service}>{concept.service}</span><a href="#contact">Create something for my brand</a></div></details>
          </div>
        </article>)}
      </div>
      <div className={styles.collectionFoot}><p>Original studio concepts. NŪRA and OFFSCRIPT are fictional brands created to explore ideas, rather than client projects or results.</p><a className="text-link" href="#contact">Your brand could be our next direction</a></div>
    </div>
  </section>;
}
