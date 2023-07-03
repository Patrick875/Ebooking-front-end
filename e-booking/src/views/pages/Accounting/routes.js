import ProformaInvoice from './ProFormaInvoice/ProformaInvoice'
import CreateProformaInvoice from './ProFormaInvoice/CreateProformaInvoice'
import ViewProFormaInvoice from './ProFormaInvoice/ViewProFormaInvoice'
import Invoice from './Invoice/Invoice'
import CreateInvoice from './Invoice/CreateInvoice'
import ViewInvoice from './Invoice/ViewInvoice'
import DeliveryNote from './DeliveryNote/DeliveryNote'
import CreateDeliveryNote from './DeliveryNote/CreateDeliveryNote'
import ViewDeliveryNote from './DeliveryNote/ViewDeliveryNote'
import DeliveryToInvoiceTransfer from './DeliveryNote/DeliveryToInvoiceTransfer'
import ProformaToInvoiceTransfer from './ProFormaInvoice/ProformaToInvoiceTransfer'
import PurchaseOrderAcc from './PurchaseOrderAcc/PurchaseOrderAcc'
import CreatePurchaseOrderAcc from './PurchaseOrderAcc/CreatePurchaseOrderAcc'
import ViewPurchaseOrderAcc from './PurchaseOrderAcc/ViewPurchaseOrderAcc'

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
    path: '/booking/accounting/proformainvoice/transfer',
    exact: true,
    name: 'Transfer pro forma to invoice',
    element: ProformaToInvoiceTransfer,
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
    path: '/booking/accounting/delivery/transfer',
    exact: true,
    name: 'Delivery Note Transfer',
    element: DeliveryToInvoiceTransfer,
  },
  {
    path: '/booking/accounting/purchaseorder',
    exact: true,
    name: 'Purchase Order',
    element: PurchaseOrderAcc,
  },
  {
    path: '/booking/accounting/purchaseorder/create',
    exact: true,
    name: 'Create purchase order',
    element: CreatePurchaseOrderAcc,
  },
  {
    path: '/booking/accounting/purchaseorder/view',
    exact: true,
    name: 'view purchase order',
    element: ViewPurchaseOrderAcc,
  },
]
