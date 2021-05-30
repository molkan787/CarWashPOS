
export default function price(value: any){
  let val = parseFloat(value);
  if(val < 0)
      return '- $' + (-val).toFixed(2);
  else
      return '$' + val.toFixed(2);
}