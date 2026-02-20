import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function LoanCalculator({ price }: { price: number }) {
  // price is in 10,000 KRW
  const [loanAmount, setLoanAmount] = useState(Math.round(price * 0.7)); // 70% default
  const [interestRate, setInterestRate] = useState(4.5); // 4.5% default
  const [loanTerm, setLoanTerm] = useState(10); // 10 years default

  const calculateMonthlyPayment = () => {
    const principal = loanAmount * 10000;
    const monthlyRate = (interestRate / 100) / 12;
    const numberOfPayments = loanTerm * 12;

    if (monthlyRate === 0) return principal / numberOfPayments;

    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return monthlyPayment;
  };

  const monthlyPayment = calculateMonthlyPayment();

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <h3 className="font-semibold text-foreground mb-4">💰 대출 이자 계산기 (원리금균등)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-sm text-muted-foreground block mb-1">대출 금액 (만 원)</label>
          <Input 
            type="number" 
            value={loanAmount} 
            onChange={(e) => setLoanAmount(Number(e.target.value))} 
            className="text-foreground"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground block mb-1">연 이자율 (%)</label>
          <Input 
            type="number" 
            step="0.1" 
            value={interestRate} 
            onChange={(e) => setInterestRate(Number(e.target.value))} 
            className="text-foreground"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground block mb-1">대출 기간 (년)</label>
          <Input 
            type="number" 
            value={loanTerm} 
            onChange={(e) => setLoanTerm(Number(e.target.value))} 
            className="text-foreground"
          />
        </div>
      </div>
      <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
        <span className="font-medium text-foreground text-sm">예상 상환액 (월)</span>
        <span className="text-xl font-bold text-accent">
          {Math.round(monthlyPayment).toLocaleString()}원
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-right">※ 대략적인 예상 금액이며, 실제 대출 금액 및 이율은 금융기관에 따라 다를 수 있습니다.</p>
    </div>
  );
}
