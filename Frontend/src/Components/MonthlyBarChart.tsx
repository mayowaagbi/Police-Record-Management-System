"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../Components/UI/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../Components/UI/chart";

// Fetch the monthly cases data from the backend
async function fetchMonthlyCases() {
  try {
    const response = await fetch("http://localhost:3000/monthly-cases");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching monthly cases:", error);
    return [];
  }
}

export function MonthlyBarChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function getData() {
      const data = await fetchMonthlyCases();
      setChartData(data);
    }
    getData();
  }, []);

  const chartConfig = {
    desktop: {
      label: "Cases",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Cases Per Month</CardTitle>
        <CardDescription>Monthly Case Data</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)} // Optional: Abbreviate the month
            />
            <YAxis />
            <Tooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="cases" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing the number of cases per month
        </div>
      </CardFooter>
    </Card>
  );
}
