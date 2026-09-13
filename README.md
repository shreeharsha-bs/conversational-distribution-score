# Conversational Distribution Score

Supplementary results for **Distributional Metrics for Evaluating Spoken Conversational Systems**.

Website: https://shreeharsha-bs.github.io/conversational-distribution-score/

This repository contains the static website, scientific figures and selected
aggregate result tables. The evaluator code and datasets will be released
separately. It contains no raw recordings, transcripts or participant identifiers.

## Explore the results

The website has 13 plot collections, covering behavioural features, listener
preferences, adjusted system ordering, reference sensitivity, weighting and
feature-removal ablations, linguistic features, TTSDS2 and recording requirements.
The [figure index](results-index.csv) lists every downloadable view.

Figures are available as PNG and PDF. Their explanations and assumptions are
provided next to them on the website. Aggregate CSVs are under `data/`.

## Interpretation

CDS measures resemblance to one reference relative to another. A score near
50 means similar distances, not necessarily closeness to either reference.
The main composite contains eight behavioural features in three equally
weighted families. Linguistic scores and TTSDS2 are separate comparisons.

Conversation-pair correlations, adjusted system rankings, pooled system
scores and descriptive conversation Bradley–Terry clouds answer different
questions. The website identifies the observations, sample counts and
reference choices for each result. The historical TTSDS2 conversation scores
used one HSC conversation; the broader pooled reference clouds do not establish
reference robustness of those listener correlations.

## Run locally

No build step or framework is required:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`. GitHub Pages serves the repository's `main`
branch from its root. `.nojekyll` preserves the static files as authored.

Contact: [Shree Harsha Bokkahalli Satish](mailto:shbs@kth.se).
