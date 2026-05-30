import React, { useMemo } from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

type WorkflowPageProps = {
  activePath: string
  onNavigate: (path: string) => void
}

type MockFlowStatus = 'Active' | 'Inactive'

type MockFlowStepType = 'Trigger' | 'Condition' | 'Action' | 'Delay'

type MockFlowStep = {
  id: string
  name: string
  type: MockFlowStepType
  description: string
}

type MockFlow = {
  id: string
  name: string
  status: MockFlowStatus
  updatedAt: string
  description: string
  trigger: { channel: string, event: string, rule: string }
  steps: MockFlowStep[]
}

function getFlowIdFromPath(pathname: string) {
  const prefix = '/flows/'
  if (!pathname.startsWith(prefix)) return null
  const id = pathname.slice(prefix.length).trim()
  return id.length ? id : null
}

function statusToVariant(status: MockFlowStatus) {
  return status === 'Active' ? 'success' : 'default'
}

export default function WorkflowPage({ activePath, onNavigate }: WorkflowPageProps) {
  const flows = useMemo<MockFlow[]>(
    () => [
      {
        id: 'b8bb608a-7bca-45cb-9a82-18e411519d3b',
        name: 'Order Confirmation',
        status: 'Active',
        updatedAt: '2026-05-30 10:32',
        description: 'Konfirmasi pesanan otomatis via WhatsApp, termasuk pembayaran dan estimasi pengiriman.',
        trigger: { channel: 'WhatsApp', event: 'Message Received', rule: 'Keyword: "konfirmasi" atau "order"' },
        steps: [
          { id: 'st-1', name: 'Validate Customer', type: 'Condition', description: 'Cek apakah nomor WA ada di database pelanggan.' },
          { id: 'st-2', name: 'Send Confirmation', type: 'Action', description: 'Kirim template konfirmasi pesanan.' },
          { id: 'st-3', name: 'Wait Payment', type: 'Delay', description: 'Tunggu 10 menit untuk pembayaran.' },
          { id: 'st-4', name: 'Notify Agent', type: 'Action', description: 'Notifikasi ke agent jika payment belum masuk.' },
        ],
      },
      {
        id: '5a6f233d-8070-4f88-9b8e-0f6dc2e6c061',
        name: 'Abandoned Cart Follow-up',
        status: 'Inactive',
        updatedAt: '2026-05-28 16:05',
        description: 'Follow-up keranjang yang ditinggalkan dan berikan promo jika diperlukan.',
        trigger: { channel: 'Orders', event: 'Cart Abandoned', rule: 'Tidak checkout > 30 menit' },
        steps: [
          { id: 'st-1', name: 'Fetch Cart Items', type: 'Action', description: 'Ambil item terakhir yang ditambahkan.' },
          { id: 'st-2', name: 'Send Reminder', type: 'Action', description: 'Kirim pesan pengingat + CTA checkout.' },
          { id: 'st-3', name: 'Apply Coupon', type: 'Action', description: 'Buat kupon diskon 5% jika eligible.' },
        ],
      },
      {
        id: '8d2e7f9c-9e1d-4af1-9498-2a608bdbba56',
        name: 'Lead Qualification',
        status: 'Active',
        updatedAt: '2026-05-27 09:11',
        description: 'Kualifikasi lead dari broadcast dan arahkan ke agent yang tepat.',
        trigger: { channel: 'Broadcast', event: 'Reply Received', rule: 'Balasan mengandung minat produk' },
        steps: [
          { id: 'st-1', name: 'Detect Intent', type: 'Condition', description: 'Deteksi niat: harga, stok, pengiriman.' },
          { id: 'st-2', name: 'Route to Queue', type: 'Action', description: 'Masukkan ke antrean agent sesuai kategori.' },
        ],
      },
    ],
    []
  )

  const flowId = getFlowIdFromPath(activePath)
  const flow = flowId ? flows.find(f => f.id === flowId) : null

  return (
    <main className="ocm-page">
      {flow ? (
        <>
          <OpenCrmSectionHeader
            title={flow.name}
            subtitle={`Flow ID: ${flow.id}`}
            actions={
              <>
                <Button variant="outline" size="sm" onClick={() => onNavigate('/flows')}>
                  Kembali
                </Button>
                <Button size="sm" onClick={() => onNavigate('/flows')}>
                  Simpan Mock
                </Button>
              </>
            }
          />

          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Badge variant={statusToVariant(flow.status)}>{flow.status}</Badge>
            <span className="text-xs text-muted-foreground">Terakhir update: {flow.updatedAt}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Deskripsi</div>
                    <div className="text-sm text-muted-foreground mt-1">{flow.description}</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold text-gray-900">Steps</div>
                  <span className="text-xs text-muted-foreground">{flow.steps.length} step</span>
                </div>

                <div className="space-y-3">
                  {flow.steps.map((s, idx) => (
                    <div key={s.id} className="flex gap-3 items-start rounded-lg border border-border bg-white p-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 items-center">
                          <div className="text-sm font-semibold text-gray-900">{s.name}</div>
                          <Badge className="text-[10px]" variant="default">{s.type}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{s.description}</div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => undefined}>
                        Detail
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold text-gray-900">Recent Runs</div>
                  <Button variant="outline" size="sm" onClick={() => undefined}>Refresh</Button>
                </div>

                <table className="ocm-table">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="py-2 pr-3 text-xs font-semibold text-muted-foreground">Run ID</th>
                      <th className="py-2 pr-3 text-xs font-semibold text-muted-foreground">Status</th>
                      <th className="py-2 pr-3 text-xs font-semibold text-muted-foreground">Channel</th>
                      <th className="py-2 text-xs font-semibold text-muted-foreground">Waktu</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {[
                      { id: 'run-1024', status: 'Success', channel: flow.trigger.channel, time: '2026-05-30 10:20' },
                      { id: 'run-1023', status: 'Success', channel: flow.trigger.channel, time: '2026-05-30 09:58' },
                      { id: 'run-1022', status: 'Failed', channel: flow.trigger.channel, time: '2026-05-30 09:41' },
                    ].map(r => (
                      <tr key={r.id} className="border-b border-border last:border-0">
                        <td className="py-2 pr-3 font-medium text-gray-900">{r.id}</td>
                        <td className="py-2 pr-3">
                          <Badge variant={r.status === 'Success' ? 'success' : 'danger'}>{r.status}</Badge>
                        </td>
                        <td className="py-2 pr-3 text-muted-foreground">{r.channel}</td>
                        <td className="py-2 text-muted-foreground">{r.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="p-6">
                <div className="text-sm font-semibold text-gray-900 mb-4">Trigger</div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-muted-foreground">Channel</span>
                    <span className="font-medium text-gray-900">{flow.trigger.channel}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-muted-foreground">Event</span>
                    <span className="font-medium text-gray-900">{flow.trigger.event}</span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="text-xs text-muted-foreground">Rule</div>
                    <div className="text-sm font-medium text-gray-900 mt-1">{flow.trigger.rule}</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-sm font-semibold text-gray-900 mb-4">Settings</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Mode</span>
                    <Badge variant="default">Mock</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Retry</span>
                    <span className="text-sm font-medium text-gray-900">3x</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Timeout</span>
                    <span className="text-sm font-medium text-gray-900">30s</span>
                  </div>
                  <div className="pt-3 border-t border-border flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => undefined}>Test Run</Button>
                    <Button variant="danger" size="sm" onClick={() => undefined}>Disable</Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <>
          <OpenCrmSectionHeader
            title="Workflows"
            subtitle="Mockup daftar workflow dan halaman detail."
            actions={<Button size="sm" onClick={() => onNavigate('/flows/b8bb608a-7bca-45cb-9a82-18e411519d3b')}>Buka Contoh</Button>}
          />

          <div className="ocm-grid-3">
            {flows.map(f => (
              <Card key={f.id} className="p-6">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 truncate">{f.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">Update: {f.updatedAt}</div>
                  </div>
                  <Badge variant={statusToVariant(f.status)}>{f.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{f.description}</p>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <Button variant="outline" size="sm" onClick={() => onNavigate(`/flows/${f.id}`)}>
                    Lihat Detail
                  </Button>
                  <span className="text-[10px] text-muted-foreground truncate">{f.id}</span>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
