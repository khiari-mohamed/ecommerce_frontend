import React, { useEffect, useState } from "react";
import DonutChartOne from "./DonutChartOne";

export default function OrdersByCategoryDonut() {
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    fetch("/api/analytics/orders-by-category")
      .then(res => res.json())
      .then(result => {
        setLabels(result.labels);
        setData(result.data);
      });
  }, []);

  return (
    <DonutChartOne
      labels={labels}
      data={data}
      title="Orders by Category"
    />
  );
}