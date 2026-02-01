import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 20,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 40,
    height: 40,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoLetter: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  companyName: {
    fontSize: 18,
    color: '#0f172a',
  },
  companySubName: {
    fontSize: 18,
    color: '#2563eb',
  },
  quoteInfo: {
    textAlign: 'right',
  },
  quoteTitle: {
    fontSize: 20,
    color: '#0f172a',
    marginBottom: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    padding: 6,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
  },
  gridColumn: {
    flex: 1,
    paddingRight: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  label: {
    color: '#64748b',
  },
  value: {
    color: '#0f172a',
  },
  priceSection: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#e2e8f0',
  },
  totalLabel: {
    fontSize: 16,
    color: '#0f172a',
  },
  totalValue: {
    fontSize: 20,
    color: '#2563eb',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 20,
    color: '#94a3b8',
    fontSize: 8,
  }
});

interface Props {
  quote: any;
}

export const QuotePDFTemplate = ({ quote }: Props) => {
  const formatEuro = (val: any) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(val || 0));

  const quoteRef = `QT-${(quote?.id || 'TEST').slice(-8).toUpperCase()}`;
  const dateStr = quote?.createdAt ? format(new Date(quote.createdAt), 'dd MMMM yyyy', { locale: fr }) : 'Date inconnue';

  return (
    <Document title={`Devis ${quoteRef}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <View style={styles.logoBox}>
              <Text style={styles.logoLetter}>H</Text>
            </View>
            <View>
              <Text style={styles.companyName}>Havet</Text>
              <Text style={styles.companySubName}>PrintPilot</Text>
            </View>
          </View>
          <View style={styles.quoteInfo}>
            <Text style={styles.quoteTitle}>DEVIS ESTIMATIF</Text>
            <Text>Référence : {quoteRef}</Text>
            <Text>Date : {dateStr}</Text>
          </View>
        </View>

        {/* Configuration Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SPÉCIFICATIONS TECHNIQUES</Text>
          <View style={styles.grid}>
            <View style={styles.gridColumn}>
              <View style={styles.row}>
                <Text style={styles.label}>Impression</Text>
                <Text style={styles.value}>{quote.printMode === 'digital' ? 'Numérique' : 'Offset'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Format</Text>
                <Text style={styles.value}>{quote.formatWidth} x {quote.formatHeight} mm</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Quantité</Text>
                <Text style={styles.value}>{(quote.quantity || 0).toLocaleString()} ex.</Text>
              </View>
            </View>
            <View style={styles.gridColumn}>
              <View style={styles.row}>
                <Text style={styles.label}>Pages</Text>
                <Text style={styles.value}>{quote.interiorPages || 0} pages</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Poids Total</Text>
                <Text style={styles.value}>{quote.totalWeight || 0} kg</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Papier</Text>
                <Text style={styles.value}>{quote.interiorPaperType || 'Silk'} {quote.interiorGrammage || 135}g</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Financial Detail */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DÉTAIL DU DEVIS</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Coût du papier</Text>
            <Text style={styles.value}>{formatEuro(quote.paperCost)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Impression & Mise en machine</Text>
            <Text style={styles.value}>{formatEuro(Number(quote.printingCost || 0) + Number(quote.makeReadyCost || 0))}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Mise en page & Façonnage</Text>
            <Text style={styles.value}>{formatEuro(quote.bindingCost)}</Text>
          </View>
          {Number(quote.laminationCost || 0) > 0 ? (
            <View style={styles.row}>
              <Text style={styles.label}>Finition (Pelliculage)</Text>
              <Text style={styles.value}>{formatEuro(quote.laminationCost)}</Text>
            </View>
          ) : null}
          <View style={styles.row}>
            <Text style={styles.label}>Logistique & Emballage</Text>
            <Text style={styles.value}>{formatEuro(Number(quote.deliveryCost || 0) + Number(quote.packagingCost || 0))}</Text>
          </View>
        </View>

        {/* Totals Section */}
        <View style={styles.priceSection}>
          <View style={styles.row}>
            <Text style={styles.label}>Prix Unitaire Hors Taxes</Text>
            <Text style={styles.value}>{formatEuro(quote.unitPrice)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL GÉNÉRAL HT</Text>
            <Text style={styles.totalValue}>{formatEuro(quote.total)}</Text>
          </View>
        </View>

        {/* Conditions */}
        <View style={{ marginTop: 40 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Conditions générales :</Text>
          <Text>• Validité du devis : 30 jours à compter de la date d&apos;émission.</Text>
          <Text>• Délais de fabrication : 5 à 7 jours ouvrés après validation du BAT.</Text>
          <Text>• Les prix sont exprimés en Euros Hors Taxes (HT).</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Imprimerie Havet Digital — 123 Rue de l&apos;Impression, 75000 Paris</Text>
          <Text>Tél: 01 23 45 67 89 | Email: contact@havet-digital.fr | Web: www.havet-digital.fr</Text>
          <Text>SIRET: 123 456 789 00010 | TVA Intracommunautaire: FR 12 345 678 901</Text>
        </View>
      </Page>
    </Document>
  );
};
