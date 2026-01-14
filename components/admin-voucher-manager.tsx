"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, CheckCircle2, XCircle, Ticket, Loader2 } from "lucide-react"
import { useGlobalModal } from "@/components/providers/modal-provider"

interface Voucher {
  _id: string
  code: string
  userName: string
  game: string
  status: "active" | "redeemed"
  createdAt: string
  redeemedAt?: string
}

export function AdminVoucherManager() {
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // 1. Destructure showConfirm
  const { showSuccess, showError, showConfirm } = useGlobalModal()

  useEffect(() => {
    fetchVouchers()
  }, [])

  const fetchVouchers = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/vouchers")
      const data = await res.json()
      setVouchers(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // 2. Updated Redeem Handler
  const handleRedeemClick = (id: string) => {
    showConfirm(
      "Redeem Voucher?",
      "Are you sure you want to mark this voucher as used? This action cannot be reversed.",
      () => performRedeem(id)
    )
  }

  const performRedeem = async (id: string) => {
    try {
      const res = await fetch("/api/vouchers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        showSuccess("Voucher Redeemed", "Customer has received their discount.")
        fetchVouchers() 
      }
    } catch (error) {
      showError("Error", "Could not redeem voucher.")
    }
  }

  const filteredVouchers = vouchers.filter(v => 
    v.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.userName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h2 className="text-2xl font-bold flex items-center gap-2">
             <Ticket className="w-6 h-6 text-primary" /> Voucher Validation
           </h2>
           <p className="text-sm text-muted-foreground">Verify and redeem game rewards</p>
        </div>
        
        <div className="relative w-full md:w-64">
           <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
           <Input 
             placeholder="Search Code or User..." 
             className="pl-8"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
             <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
        ) : filteredVouchers.length === 0 ? (
             <p className="text-center text-muted-foreground py-8">No vouchers found.</p>
        ) : (
          filteredVouchers.map((voucher) => (
            <div key={voucher._id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-muted/30 transition-all">
              
              <div className="flex items-center gap-4 w-full">
                <div className={`p-3 rounded-full ${voucher.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Ticket className={`w-6 h-6 ${voucher.status === 'active' ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                
                <div>
                   <h4 className="font-mono text-xl font-bold tracking-wider">{voucher.code}</h4>
                   <div className="text-sm text-muted-foreground flex gap-2">
                      <span>{voucher.userName}</span>
                      <span>•</span>
                      <span className="capitalize">{voucher.game} Game</span>
                   </div>
                   <p className="text-xs text-muted-foreground mt-1">
                      {new Date(voucher.createdAt).toLocaleDateString()}
                   </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                 {voucher.status === "active" ? (
                    <>
                        <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Valid</Badge>
                        {/* 3. Use new handler */}
                        <Button size="sm" onClick={() => handleRedeemClick(voucher._id)}>
                            Redeem Now
                        </Button>
                    </>
                 ) : (
                    <>
                        <Badge variant="outline" className="text-muted-foreground">Redeemed</Badge>
                        <span className="text-xs text-muted-foreground">
                            {voucher.redeemedAt && new Date(voucher.redeemedAt).toLocaleDateString()}
                        </span>
                    </>
                 )}
              </div>

            </div>
          ))
        )}
      </div>
    </Card>
  )
}