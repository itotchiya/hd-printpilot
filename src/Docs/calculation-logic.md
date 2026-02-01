Havet/IMB Quotation Logic – Detailed Documentation

This document distils the logic embedded in the macro‑enabled workbook “Tableau Numérique‑Offset HAVET‑IMB 29‑01‑2026.xlsm”. The goal is to enable an engineer or AI agent to rebuild the same quote calculator as a web application, using a rules engine and form wizard. All inputs, validation rules, formulas and fixed data from the workbook are described here. References to named sheets/cells correspond to the original Excel model. Citations are provided for traceability
newtab
.

1. Key data tables

The workbook relies on several sheets that act purely as reference data. They should be turned into structured tables (e.g. JSON or database tables) in your application.

1.1 Paper table – Tableau papier

This sheet lists available paper grammages and prices. Each row represents a grammage (weight) in grams per square metre (gsm). The columns correspond to different paper types. Important paper types used in drop‑down lists include:

Named range	Description
CoucheMatInterieur	Grammages for matt coated stock (interior)
CoucheSatinInterieur	Grammages for satin coated stock (interior)
Brillantinterieur	Grammages for glossy paper (interior)
OffsetInterieur	Grammages for uncoated offset paper
RecycleOffset	Grammages for recycled paper
BouffantBlanc	Grammages for white book paper
BouffantMunkenBlanc	Grammages for Munken white book paper
BouffantMunkenCreme	Grammages for Munken cream paper
CoucheMatCouv etc.	Grammages for various cover stocks

For each paper type there are also price columns (€/kg) for each press format (64×90, 65×92, 70×102, 72×102). When quoting, the engine must look up the price per kilogram for the selected grammage and format.

1.2 Finishing tables – Tableau Façonnage Num and Tableau Façonnage OFFSET

These sheets contain per‑unit and fixed costs for binding, lamination and other finishing tasks. Each binding type (e.g. “Dos carré collé” = perfect binding, “Dos carré collé PUR” = PUR perfect binding, and “Piqûre” = saddle stitching) has cost grids indexed by quantity range and page range. For example, in the digital table (Tableau Façonnage Num):

Columns B–G (rows 3–7) – per‑unit and fixed costs for perfect binding at different quantity brackets (≤100 copies, 101–200, 201–300, 301–400, 401–500, >500) and page ranges (≤72 pages, 76–152 pages, >152 pages). Each cell holds the per‑unit cost, and the row below holds the fixed cost. The PUR binding costs are in the second block (rows 11–19). Saddle stitching (Piqûre) and lamination costs occupy subsequent blocks.

Columns B–G (rows 19–25) – lamination (pelliculage) costs: per‑unit and fixed cost thresholds (≤100, ≤300, ≤500, ≤1 000, ≤2 500 copies). The cost depends on whether lamination is single‑sided or double‑sided.

In the offset finishing table (Tableau Façonnage OFFSET) the structure is similar but tailored for offset print runs. It also contains lists used for drop‑down menus (PelliculageSimple, PelliculageComplet, ListePelliculage) specifying lamination orientations and finishes.

1.3 Transport matrix – Transports

The transport sheet holds a tariff matrix where rows correspond to French departments (e.g. “75 ‑ Paris”) and columns correspond to weight brackets in kilograms (e.g. 0–1 kg, 1–2 kg, …). Each cell gives the delivery cost for that department and weight range. The first row defines the weight thresholds. The named list ListeDept refers to the department column, providing the drop‑down options for delivery destinations. Some formulas add a supplement when a tail‑lift truck (“Hayon”) is required.

1.4 Machine settings – Réglages Presses

This sheet stores machine‑specific constants used to compute make‑ready and running costs for offset printing. For example, it contains the number of sheets per hour, cost per plate, hourly rates, and waste factors for different presses and paper sizes. The formulas in the Détails PRIX sheet refer to these values using INDEX/MATCH.

2. Digital printing logic (Tableau NUMERIQUE and Donnees Num)
2.1 Input fields and drop‑down options

The digital quote form (sheet Tableau NUMERIQUE) can be implemented as a multi‑step wizard. Each user input corresponds to a specific cell, and most fields have restricted lists. The following table summarises the inputs:

Step	Field (cell)	Purpose / allowable values
 1	Quantity (A3)	Number of copies (integer).
 2	Finished format (B3)	Free‑form text like “21x29,7” (width × height in cm). A validation ensures exactly one “x” and numeric values.
 3	Interior pages (A5)	Must be a multiple of 4. If binding is “Dos carré collé” or “Dos carré collé PUR”, minimum 40 pages; if “Piqûre”, the page count must not exceed the limit stored in Donnees Num!D7 (usually 96).
 4	Cover pages (B5)	Drop‑down list: 0 (no cover), 2 (recto), 4 (recto verso).
 5	Interior paper type (A7)	Drop‑down: “Autre”, “Couché Mat”, “Couché Satin”, “Brillant”, “Offset”, “Recyclé”, “Bouffant Blanc”, “Bouffant Munken Blanc”, “Bouffant Munken Crème”. The selection determines which grammage list is presented in A8 via a named range (e.g. CoucheMatInterieur).
 6	Cover paper type (B7)	Drop‑down: “Autre”, “Couché Mat”, “Couché Satin”, “Brillant”, “Carte 1 face”, “Offset”, “Recyclé”. A dynamic range chosen via INDIRECT(M1) gives the grammages for B8.
 7	Interior grammage (A8)	Drop‑down from the selected paper type (see step 5).
 8	Cover grammage (B8)	Drop‑down from the selected cover paper type (see step 6).
 9	Interior colours (A10)	Drop‑down: “Quadrichromie” or “Noir”.
 10	Cover colours (B10)	Drop‑down: “Quadrichromie” or “Noir”. When quoting only interior (no cover), this can be ignored.
 11	Binding type (A12)	Drop‑down: “Rien”, “Dos carré collé”, “Dos carré collé PUR”, “Piqûre”.
 12	Lamination orientation (B12)	Drop‑down: “Recto”, “Recto Verso”, “Non”. The list changes to “Pelliculage Simple” or “Pelliculage Complet” depending on binding and cover options.
 13	Lamination finish (C12)	Drop‑down: “Mat”, “Brillant”, “Soft Touch”.
 14	Additional product type (A38)	When “Dépliant” is selected as the product type, further drop‑downs appear: fold type (B38: “Roulé”, “Accordéon”, “Croisé”, “Rien”), number of folds (C38: 1 to 6), second fold type (D38: “Croisé”, “Rien”), and number of cross‑folds (E38: 0–2). For “Flyer/Poster” or “Carte de visite” no fold inputs are needed.
 15	Packaging (A45)	Drop‑down: “Non”, “A l’unité”, “Par paquet”, “Par 2”, “Par 3”, “Par 4”, “Par 5‑10”.
 16	Delivery lines (rows 15–19)	For each delivery destination the user enters: quantity (B15:B19), department (D15:D19, drop‑down from ListeDept), and whether a tail‑lift is required (E15:E19, “Oui”/“Non”). The model allows up to 5 destinations.

Other hidden inputs include a manual margin factor (Donnees Num!E12) and overheads; in the Excel file these are fixed cells the user rarely edits.

2.2 Validation rules

Page and binding constraints – cell A5 has a custom validation referencing M1: the interior page count must be divisible by 4. If binding is perfect (Dos carré collé or PUR) the page count must be ≥ 40. If binding is saddle stitching (Piqûre), the page count must not exceed the limit stored in Donnees Num!D7. This prevents technically unfeasible jobs.

Format string – cell B3 is validated to contain exactly one “x” separating width and height, and both parts must be numeric. Use a regular expression such as ^[0-9]+(\.[0-9]+)?x[0-9]+(\.[0-9]+)?$.

Rabat width for offset with flaps – not applicable in digital but relevant for the offset model (see §3.2). It ensures that the flap does not exceed the finished width and that 2×width + rabat ≤ 76 cm.

2.3 Calculations in digital mode

The Donnees Num sheet implements the calculation engine. The formulas can be expressed as functions for the web app:

Weight per copy – compute the area of one sheet (from B3: width × height in cm), multiply by the number of interior pages/2 and the grammage (A8). Add cover weight: for recto or recto‑verso covers the formula multiplies the width by height and the cover grammage (B8) plus an allowance for the spine (Donnees Num!F12). Convert to grams using the factor 9 769 cm²/kg (i.e. weight = area × grammage / 9 769). The result is shown in Tableau NUMERIQUE!A22. Multiply by quantity to get total job weight (kg) in B22
newtab
.

Paper cost – look up the price per kilogram for the selected paper type/grammage and press format. Multiply by the weight of interior and cover (kg) to obtain raw paper cost. This is performed in Donnees Num!A9:A11 for interior and Donnees Num!B9:B11 for cover via VLOOKUP into Tableau papier. The digital format is assumed constant for all digital jobs.

Printing cost – base printing costs depend on colours and number of pages. Constants Donnees Num!H15 and I15 represent the cost per side for quadrichrome or monochrome printing; the formulas multiply these by the number of printed sides (C26/D26) which are derived from page count. For covers, I15 is used. Additional base costs (make‑ready) are added in Donnees Num!D4 and D5.

Binding and finishing – depending on the chosen binding (A12) and the quantity, the engine uses the digital finishing table (Tableau Façonnage Num) to compute a per‑unit cost and a fixed setup cost:

Saddle stitching (Piqûre) – if there is a cover (B5 > 0), and quantity ≤ 200, use the price pair (per‑unit, fixed) from row 24 (C24/B24). Between 200–300 copies use row 25 (C25/B25); if there is no cover the cost is simplified (0.23 €/unit + 10 € if ≤200; 0.25 €/unit + 30 € otherwise). The formula picks the correct bracket based on A3 and B5.

Perfect binding (Dos carré collé) – choose the correct cost block based on page range (≤72 pages, 76–152, >152) and quantity bracket (≤100, 101–200, …, >500). For example, if pages ≤ 72 and quantity ≤ 100, the cost is A3 * B3 + B6; if pages 76–152 and 101–200 copies, cost is A3 * C4 + C6, and so on. PUR binding uses another block with similar structure but referencing columns B11–G13 and fixed costs in row 14. These nested IF statements (seen in Donnees Num!D10:D11) can be turned into a function that indexes a three‑dimensional array keyed by (binding type, page range, quantity range).

Lamination (Pelliculage) – if lamination is selected (B12 not equal to “Non”), compute lamination cost based on quantity and orientation. Single‑sided lamination uses the cost array Tableau Façonnage Num!B19:F20 (limits: ≤100, ≤300, ≤500, ≤1 000, ≤2 500 copies), while double‑sided lamination uses Tableau Façonnage Num!B24:F25. Multiply the per‑unit cost by quantity and add the fixed cost.

Packaging and extra operations – if packaging (A45) is not “Non”, add the per‑unit packaging cost defined in Tableau Façonnage Num (rows 28–30). For folded leaflets, there are additional costs based on fold type and number of folds.

Delivery cost – for each destination line, compute the shipping cost using the Transport matrix: determine the weight bracket based on job weight per parcel (quantity divided by number of destinations) and find the corresponding tariff for the selected department (ListeDept). Add a supplement (e.g. 60 €) if a tail‑lift is required. Tableau NUMERIQUE!F15:F19 perform this lookup using MATCH/INDEX and take the minimum applicable rate.

Totals – the production subtotal equals printing + binding/finishing + lamination + packaging (from Donnees Num!D21). This subtotal plus total delivery (F20) and optional manual margin (Donnees Num!E12) is multiplied by 1.05 to include a 5 % general margin: this final price appears in Tableau NUMERIQUE!A25.

3. Offset printing logic (Tableau OFFSET, Détails PRIX, Détails PRIX DEPLIANTS)

Offset quoting is more involved because the model chooses the optimal press format, computes the number of printing plates, calculates make‑ready time, and factors in imposition and waste. The main input sheet is Tableau OFFSET and the calculation engines are in Détails PRIX and Détails PRIX DEPLIANTS.

3.1 Input fields and drop‑downs

Offset inputs mirror those of the digital model with additional options:

Step	Field (cell)	Purpose / allowable values
 1	Quantity (A3)	Number of copies (integer).
 2	Finished format (B3)	Text like “21x29,7”. A custom validation ensures one “x” and numeric width/height.
 3	Rabat width (D5)	Applicable when printing brochures with flaps. Validation checks that the flap does not exceed the finished width and that 2×width + rabat ≤ 76 cm. If no flap is needed, set C5=0.
 4	Interior pages (A5)	Must be a multiple of 4. Additional rules: for perfect binding (Dos carré collé/PUR) the page count must be ≥ 40; for saddle stitching (Piqûre), the maximum number of signatures depends on the number of forms that fit on a sheet (determined in Détails PRIX!D8 and D7). The validation formula M6 enforces these constraints.
 5	Cover pages (B5)	Drop‑down: 0 (no cover), 2, 4. A prompt reminds the user to enter 0 if there is no cover.
 6	Interior paper type (A7)	Drop‑down: “Autre”, “Bouffant Blanc”, “Bouffant Munken Blanc”, “Bouffant Munken Crème”, “Couché Mat”, “Couché Satin”, “Brillant”, “Carte 1 face”, “Offset”, “Recyclé”, “Bouffant”. The selected type determines the grammage list shown in A8.
 7	Cover paper type (B7)	Drop‑down: “Autre”, “Couché Mat”, “Couché Satin”, “Brillant”, “Carte 1 face”, “Offset”, “Recyclé”.
 8	Interior grammage (A8)	Drop‑down from the selected paper type via INDIRECT(L1).
 9	Cover grammage (B8)	Drop‑down from the selected cover paper type via INDIRECT(M1).
 10	Interior colours (A11)	Drop‑down: “Quadrichromie”, “Quadrichromie + Vernis Machine”, “Bichromie”, “Noir”.
 11	Cover colours (B11)	Drop‑down: same list as interior colours.
 12	Binding type (A13)	Drop‑down: “Rien”, “Dos carré collé”, “Dos carré collé PUR”, “Dos carré collé avec couture”, “Piqûre”.
 13	Lamination orientation (C11)	Dynamic list: if the job has a cover (B5 > 0) and lamination is selected, choose from PelliculageSimple for single‑sided lamination or PelliculageComplet for double‑sided. Otherwise “Rien”.
 14	Lamination finish (D11)	Drop‑down: “Mat”, “Brillant”, “Soft Touch”. This uses the named range ListePelliculage.
 15	Product type (A42)	Drop‑down: “Flyer/Poster”, “Carte de visite”, “Dépliant”. When “Dépliant” is chosen the following fields appear:
 	Primary fold type (B42)	“Roulé”, “Accordéon”, “Croisé”, “Rien”.
 	Number of folds (C42)	1–6.
 	Secondary fold (D42)	“Croisé” or “Rien”.
 16	Secondary paper type (A37)	If a depliant uses a different paper inside, drop‑down: “Autre”, “Couché Mat”, “Couché Satin”, “Brillant”, “Offset”, “Recyclé”. This influences A38 (grammage).
 17	Lamination orientation for depliant (C40)	“Recto”, “Recto Verso”, “Non”.
 18	Packaging (A18)	Drop‑down: “Non”, “A l’unité”, “Par paquet”, “Par 2”, “Par 3”, “Par 4”, “Par 5‑10”.
 19	Delivery lines (B21:B25 and B52:B56)	Each line contains quantity, department (from ListeDept), and tail‑lift (“Oui”/“Non”). Multiple groups of delivery inputs exist for different product scenarios.
3.2 Validation rules

Offset printing validations mirror those for digital: the page count must be divisible by 4, a minimum of 40 pages applies for perfect binding, and saddle stitching has an upper bound. In addition, the rabat (flap) width (C5/D5) must satisfy 2×width + rabat ≤ 76 cm and rabat ≤ width. The format string B3 must contain exactly one “x” and numeric width/height values. If the user enters a delivery quantity (B21) without selecting a department, a custom validation prompts the user to choose a department.

3.3 Core calculations for offset quoting

Offset pricing is calculated in the hidden sheets Détails PRIX and Détails PRIX DEPLIANTS. The logic can be implemented as follows:

Signature and imposition determination – break the interior page count into signatures based on imposition capacities. For example, a 16‑page signature corresponds to a sheet printed on both sides that yields 8 pages per side. In Détails PRIX!D2:D7, formulas compute how many 16‑page, 12‑page, 8‑page, 6‑page, 4‑page and single‑page signatures are needed to cover the interior page count. For each signature type C2:C7 contains a text description (e.g. “16 pages”). The cells E2:E7 determine whether a signature is printed with varnish or not (used to adjust the number of printing plates).

Make‑ready cost – the base make‑ready cost for interior printing is 500 € if there is at least one signature. For each signature printed with varnish, a reduced factor of 0.65 applies to the cost. This computation is seen in Détails PRIX!A5. Cover make‑ready cost (B5) adds 200 € for a 2‑page cover and 300 € for a 4‑page cover.

Paper cost – compute the total kilograms printed for interior and cover: (number_of_sheets × quantity) / 1 000 multiplied by the price per kg looked up from the paper table based on format. The variables A9 and B9 perform this using nested IF statements to select the correct price column for formats “64x90”, “65x92”, “70x102” or “72x102”.

Choosing the press format – cells E13 and F13 pick the most economical press format for interior and cover. They compare the total cost of all signatures printed in each format (N68, M68, O68 for interior; Q53–Q55 for covers) and choose the smallest. The chosen format influences paper price and waste.

Grammage validation – C13 and D13 look up the maximum allowed grammage for the chosen paper type; if the selected grammage is not found in Tableau papier, an error message is returned (“Grammage non trouvé”).

Number of plates and sides – interior plates (A17) are computed by multiplying the number of forms by the number of colours plus varnish. For example, quadrichrome printing requires 4 plates per side; “Quadrichromie + Vernis Machine” adds an extra plate for varnish. The number of forms equals the sum of all signature counts minus any signatures printed as duplex; varnished signatures reduce the number of forms because they are run in one pass. Cover plates (B18) are computed similarly but scaled by the number of cover pages and whether a flap is present.

Running cost – multiply the number of printed sheets by the hourly rate per thousand sheets and add make‑ready time. The sheet speed and hourly rates come from Réglages Presses (e.g. I55:I56). An additional waste percentage (10–15 %) is applied to account for misprints. Cells C17:C19 in Détails PRIX compute the run time and then cost using machine rates.

Finishing cost – for offset binding, use the offset finishing table (Tableau Façonnage OFFSET) to look up the per‑unit and fixed costs based on page range and quantity bracket. The binding type is A13 (“Piqûre”, “Dos carré collé” with or without stitching). Lamination costs are also looked up here using the lists PelliculageSimple, PelliculageComplet, and ListePelliculage. Additional fold and packaging costs for depliants are calculated in Détails PRIX DEPLIANTS using similar logic.

Lamination and varnish – if lamination or machine varnish is selected, add the cost of lamination per sheet (depending on format and orientation) or cost per plate for varnish. The lamination finish (“Mat”, “Brillant”, “Soft Touch”) may have a small price multiplier; this can be encoded as constants.

Delivery cost – as in digital mode, for each delivery destination compute the shipping cost by looking up the weight bracket and department in the Transport matrix and adding the tail‑lift supplement where necessary.

Total cost – sum interior printing cost, cover printing cost, paper cost, make‑ready, finishing, lamination, packaging and delivery. Apply a markup of 7 % (the Excel multiplies by 1.07) to arrive at the price shown in Tableau OFFSET!A62 and A63. The markup can be adjusted by editing a single cell in the workbook and should be exposed as a configuration parameter in your application.

4. Process wizard design for the web application

To reproduce the Excel logic as an interactive web application, implement a wizard that guides the user through all required choices. Each step should present only the relevant fields, with drop‑downs populated from the tables above. A suggested flow is:

Select print technology – Digital or Offset. (If the user doesn’t know, the app can suggest offset for high quantities or large formats and digital for short runs.)

Quantity and format – Ask for quantity and finished format (width × height). Validate the format string.

Page counts – Ask for interior pages and cover pages (0, 2 or 4). For digital: enforce multiple‑of‑4 and page limits based on binding. For offset: also ask rabat (flap) width when relevant and apply the 76 cm rule.

Paper selection – Present drop‑downs for paper type and grammage for interior and cover. After the user selects a paper type, populate the grammage list from the appropriate named range. Validate that the chosen grammage exists in the paper table. For depliants that use two different papers, repeat the selection for the second paper (A37/A38).

Colours – Ask for interior and cover colours: “Quadrichromie”, “Quadrichromie + Vernis Machine”, “Bichromie”, or “Noir”. Adjust printing plate counts accordingly.

Binding / Finishing – Let the user choose binding type from the list. If lamination is required, ask for lamination orientation (single or double sided) and finish (Mat, Brillant, Soft Touch). For depliants ask for fold type, number of folds and secondary fold. Show/hide fields dynamically based on the product type (“Flyer/Poster”, “Carte de visite”, “Dépliant”).

Packaging – Present the packaging options. If packaging is selected, use the cost tables to compute the extra cost per unit.

Delivery – Allow up to five (digital) or more (offset) delivery destinations. For each destination ask for quantity, department (with auto‑complete using ListeDept) and whether a tail‑lift is required. Validate that a department is selected when a quantity is entered.

Review and compute – Once all inputs are provided, compute the quote by running the digital or offset engine described above. Display a detailed breakdown: paper cost, printing cost, binding/finishing, lamination, packaging, delivery and total. Offer to export the quote as PDF.

Your rules engine should encapsulate all conditions and piecewise formulas described in §§2–3. Use functions instead of nested IF statements for clarity: for example, binding_cost(binding_type, pages, quantity, has_cover) → (per_unit, fixed) can look up values in pre‑loaded tables. Similarly, paper_price(paper_type, grammage, format) returns a price per kg. Use the transport table to implement delivery_cost(weight, department, hayon).

5. Summary of drop‑down lists

For quick reference, here are the lists you must reproduce in the UI:

Interior paper types (digital & offset): “Autre”, “Couché Mat”, “Couché Satin”, “Brillant”, “Offset”, “Recyclé”, “Bouffant Blanc”, “Bouffant Munken Blanc”, “Bouffant Munken Crème”, plus “Bouffant” in the offset model.

Cover paper types: “Autre”, “Couché Mat”, “Couché Satin”, “Brillant”, “Carte 1 face”, “Offset”, “Recyclé”.

Interior grammage / cover grammage: values are drawn from the corresponding named ranges (see §1.1). For example, CoucheMatInterieur might be {90, 115, 135, 150, 170, 200, 250, 300}. A complete list can be read from the paper table.

Colours: “Quadrichromie”, “Quadrichromie + Vernis Machine”, “Bichromie”, “Noir”.

Binding types: “Rien”, “Dos carré collé”, “Dos carré collé PUR”, “Dos carré collé avec couture” (offset only), “Piqûre”.

Lamination orientation: “Recto”, “Recto Verso”, “Non”.

Lamination finish: “Mat”, “Brillant”, “Soft Touch”.

Product type: “Flyer/Poster”, “Carte de visite”, “Dépliant”.

Fold type (dépliant): “Roulé”, “Accordéon”, “Croisé”, “Rien”.

Number of folds: 1–6. Cross‑folds: 0–2.

Packaging: “Non”, “A l’unité”, “Par paquet”, “Par 2”, “Par 3”, “Par 4”, “Par 5‑10”.

Department list: Use the ListeDept column from the transport matrix. Each item is a string like “75 ‑ Paris”.

Tail‑lift: “Oui”, “Non”.

6. Implementation notes

Data storage – Extract the static tables from the workbook (paper prices, finishing costs, transport matrix, machine settings) into structured data files. Use them as look‑up tables in your code instead of hard‑coding values.

Formula conversion – The Excel model uses long nested IF statements. Simplify these by using small helper functions and data driven lookups. For example, to compute finishing cost, define a two‑dimensional array keyed by (page_range, quantity_range) that returns (per_unit, fixed). This greatly improves readability and maintainability.

Error handling – When a user selects incompatible options (e.g. grammage not available for a certain paper type, or page count outside allowed range), show an immediate validation error similar to the Excel error messages.

Configurable margins – The margins (5 % for digital, 7 % for offset) and manual markup cells should be exposed as configuration parameters rather than hard‑coded constants. The Excel file uses cells Donnees Num!E12 and Détails PRIX!… for this purpose.

Versioning – Because printing costs, paper prices and transport rates change over time, design your application so that these tables can be updated without code changes. Consider an admin interface to import new CSV/Excel files.

By following this documentation, an AI or developer should be able to reconstruct the complete logic of the Havet/IMB quotation engine in a modern web application
newtab
. Every input, constraint and calculation from the Excel workbook has been described or referenced. Feel free to refine the wizard steps or UI, but the underlying rules must remain faithful to the original model to ensure consistent pricing.