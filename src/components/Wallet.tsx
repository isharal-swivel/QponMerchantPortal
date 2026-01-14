import React from 'react';
import { Download, CreditCard, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

export function Wallet() {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">Wallet & Billing</h2>
          <p className="text-gray-500 dark:text-blue-200/70 transition-colors duration-300">Manage your payouts and commissions.</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" /> Download Statement
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-[#0E2250] text-white border-none">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/70 text-sm font-medium">Available Balance</p>
                <h3 className="text-3xl font-bold mt-1">LKR 124,500.00</h3>
              </div>
              <div className="p-3 bg-white/10 rounded-xl">
                <WalletIcon className="w-6 h-6 text-[#E35000]" />
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <Button className="bg-[#E35000] hover:bg-[#c44500] text-white flex-1 border-none">
                Send Invoice
              </Button>
              <Button className="bg-white/10 hover:bg-white/20 text-white border-none">
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader>
             <CardTitle className="text-[#0E2250]">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               {[
                 { desc: "Weekly Settlement", date: "Oct 24, 2023", id: "#TXN-8829", amount: "- LKR 124,000", type: "debit" },
                 { desc: "Redemption: Seafood Platter", date: "Oct 24, 2023", id: "#REF-9921", amount: "+ LKR 4,500", type: "credit" },
                 { desc: "Redemption: Spa Package", date: "Oct 24, 2023", id: "#REF-9920", amount: "+ LKR 8,500", type: "credit" },
                 { desc: "Redemption: City Tour", date: "Oct 23, 2023", id: "#REF-9919", amount: "+ LKR 2,500", type: "credit" },
                 { desc: "Commission Fee (10%)", date: "Oct 23, 2023", id: "#COM-2211", amount: "- LKR 250", type: "fee" },
               ].map((txn, i) => (
                 <div key={i} className="flex items-center justify-between border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                   <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-full ${
                       txn.type === 'credit' ? 'bg-emerald-100 text-emerald-600' : 
                       txn.type === 'debit' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                     }`}>
                       {txn.type === 'credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                     </div>
                     <div>
                       <p className="font-medium text-[#0E2250]">{txn.desc}</p>
                       <p className="text-xs text-gray-400">{txn.date} • {txn.id}</p>
                     </div>
                   </div>
                   <span className={`font-medium ${
                      txn.type === 'credit' ? 'text-emerald-600' : 'text-gray-900'
                   }`}>
                     {txn.amount}
                   </span>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>
      </div>

       <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#0E2250]">Billing Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 border rounded-lg">
             <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
               <CreditCard className="w-5 h-5 text-gray-500" />
             </div>
             <div className="flex-1">
               <p className="font-medium text-[#0E2250]">Bank of Ceylon •••• 4482</p>
               <p className="text-sm text-gray-500">Primary Payout Method</p>
             </div>
             <Button variant="ghost" className="text-[#E35000]">Edit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
