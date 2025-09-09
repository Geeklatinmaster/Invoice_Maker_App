// Sample data for testing dashboard functionality
export const sampleInvoices = [
  {
    id: "inv_2025_001",
    code: "GLM-2025-000001",
    clientId: "client_1",
    clientName: "Acme Corp",
    issueDate: "2025-01-15",
    dueDate: "2025-02-15",
    currency: "USD",
    status: "Paid",
    items: [
      { id: "item_1", name: "Web Development", description: "Frontend development services", qty: 1, unitPrice: 2500 },
      { id: "item_2", name: "Design Services", description: "UI/UX design", qty: 1, unitPrice: 1200 }
    ],
    subtotal: 3700,
    tax: 370,
    discount: 0,
    total: 4070,
    paidAt: "2025-01-20T10:00:00Z"
  },
  {
    id: "inv_2025_002", 
    code: "GLM-2025-000002",
    clientId: "client_2",
    clientName: "Tech Solutions LLC",
    issueDate: "2025-01-20",
    dueDate: "2025-02-20",
    currency: "USD", 
    status: "Sent",
    items: [
      { id: "item_3", name: "Consulting", description: "Technical consulting", qty: 8, unitPrice: 150 }
    ],
    subtotal: 1200,
    tax: 120,
    discount: 0,
    total: 1320,
    sentAt: "2025-01-20T14:30:00Z"
  },
  {
    id: "quote_2025_001",
    code: "GLM-2025-000003", 
    clientId: "client_3",
    clientName: "Startup Inc",
    issueDate: "2025-01-25",
    dueDate: "2025-02-25",
    currency: "USD",
    status: "Draft",
    items: [
      { id: "item_4", name: "Mobile App", description: "iOS and Android app development", qty: 1, unitPrice: 8000 }
    ],
    subtotal: 8000,
    tax: 800,
    discount: 400,
    total: 8400
  },
  {
    id: "inv_2025_003",
    code: "GLM-2025-000004",
    clientId: "client_1", 
    clientName: "Acme Corp",
    issueDate: "2025-01-10",
    dueDate: "2025-01-10",
    currency: "USD",
    status: "Overdue",
    items: [
      { id: "item_5", name: "Maintenance", description: "Monthly maintenance", qty: 1, unitPrice: 500 }
    ],
    subtotal: 500,
    tax: 50,
    discount: 0, 
    total: 550
  },
  {
    id: "inv_2024_012",
    code: "GLM-2024-000012",
    clientId: "client_4",
    clientName: "Enterprise Co",
    issueDate: "2024-12-15",
    dueDate: "2025-01-15", 
    currency: "USD",
    status: "Paid",
    items: [
      { id: "item_6", name: "Infrastructure", description: "Server setup and configuration", qty: 1, unitPrice: 3200 }
    ],
    subtotal: 3200,
    tax: 320,
    discount: 160,
    total: 3360,
    paidAt: "2024-12-20T09:00:00Z"
  },
  {
    id: "quote_2025_002",
    code: "GLM-2025-000005",
    clientId: "client_5", 
    clientName: "Digital Agency",
    issueDate: "2025-01-28",
    dueDate: "2025-02-28",
    currency: "USD",
    status: "Sent", 
    items: [
      { id: "item_7", name: "SEO Package", description: "6-month SEO optimization", qty: 6, unitPrice: 800 }
    ],
    subtotal: 4800,
    tax: 480,
    discount: 240,
    total: 5040,
    sentAt: "2025-01-28T16:45:00Z"
  }
];

export function initializeSampleData() {
  const existing = localStorage.getItem('invoices-data');
  if (!existing) {
    localStorage.setItem('invoices-data', JSON.stringify(sampleInvoices));
    console.log('Sample invoice data initialized');
  }
}