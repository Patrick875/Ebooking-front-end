import ProformaInvoice from './ProFormaInvoice/ProformaInvoice'
import CreateProformaInvoice from './ProFormaInvoice/CreateProformaInvoice'
import ViewProFormaInvoice from './ProFormaInvoice/ViewProFormaInvoice'
import Invoice from './Invoice/Invoice'
import CreateInvoice from './Invoice/CreateInvoice'
import ViewInvoice from './Invoice/ViewInvoice'
import DeliveryNote from './DeliveryNote/DeliveryNote'
import CreateDeliveryNote from './DeliveryNote/CreateDeliveryNote'
import ViewDeliveryNote from './DeliveryNote/ViewDeliveryNote'
import BaudDeCommande from './BonDeCommande/BaudDeCommande'
import CreateBaudDeCommande from './BonDeCommande/CreateBaudDeCommande'
import ViewBonDeCommande from './BonDeCommande/ViewBonDeCommande'

export const accountingRoutes = [
  {
    path: '/booking/accounting/proformainvoice',
    exact: true,
    name: 'Pro forma invoice',
    element: ProformaInvoice,
  },
  {
    path: '/booking/accounting/proformainvoice/create',
    exact: true,
    name: 'Create Pro forma invoice',
    element: CreateProformaInvoice,
  },
  {
    path: '/booking/accounting/proformainvoice/view',
    exact: true,
    name: 'Create Pro forma invoice',
    element: ViewProFormaInvoice,
  },
  {
    path: '/booking/accounting/invoice',
    exact: true,
    name: 'Invoice',
    element: Invoice,
  },
  {
    path: '/booking/accounting/invoice/create',
    exact: true,
    name: 'Create invoice',
    element: CreateInvoice,
  },
  {
    path: '/booking/accounting/invoice/view',
    exact: true,
    name: 'Create invoice',
    element: ViewInvoice,
  },
  {
    path: '/booking/accounting/delivery',
    exact: true,
    name: 'Delivery Note',
    element: DeliveryNote,
  },
  {
    path: '/booking/accounting/delivery/create',
    exact: true,
    name: 'Create Delivery Note',
    element: CreateDeliveryNote,
  },
  {
    path: '/booking/accounting/delivery/view',
    exact: true,
    name: 'View Delivery Note',
    element: ViewDeliveryNote,
  },
  {
    path: '/booking/accounting/bon-de-commande',
    exact: true,
    name: 'Bon de commande',
    element: BaudDeCommande,
  },
  {
    path: '/booking/accounting/bon-de-commande/create',
    exact: true,
    name: 'Create baud de commancde',
    element: CreateBaudDeCommande,
  },
  {
    path: '/booking/accounting/bon-de-commande/view',
    exact: true,
    name: 'Create baud de commancde',
    element: ViewBonDeCommande,
  },
]
