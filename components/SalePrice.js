import styled from "styled-components";
import {formatMoney, getSaleInfo} from "@/lib/pricing";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

const OldRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const OldPrice = styled.span`
  font-size: ${props => props.$compact ? '0.8rem' : '0.95rem'};
  color: #9ca3af;
  text-decoration: line-through;
`;

const Badge = styled.span`
  display: inline-block;
  background: #dc2626;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1;
  padding: 4px 6px;
  border-radius: 4px;
`;

const Current = styled.span`
  font-size: ${props => props.$compact ? '1rem' : '1.15rem'};
  font-weight: 700;
  color: ${props => props.$sale ? '#111827' : 'inherit'};
`;

export default function SalePrice({
  price,
  compareAtPrice,
  currency = 'EUR',
  compact = false,
}) {
  const sale = getSaleInfo(price, compareAtPrice);
  if (sale.price === null) return null;

  return (
    <Wrap>
      {sale.onSale && (
        <OldRow>
          <OldPrice $compact={compact}>{formatMoney(sale.compareAt, currency)}</OldPrice>
          {sale.percent > 0 && <Badge>-{sale.percent}%</Badge>}
        </OldRow>
      )}
      <Current $compact={compact} $sale={sale.onSale}>
        {formatMoney(sale.price, currency)}
      </Current>
    </Wrap>
  );
}
