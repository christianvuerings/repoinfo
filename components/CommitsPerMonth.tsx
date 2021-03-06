import React, { useRef, useEffect } from "react";
import useSWR from "swr";
import * as d3 from "d3";

async function fetcher<T>(url: string): Promise<T> {
  const r = await fetch(url);
  const json = await r.json();

  if (json && json.error) {
    throw new Error(json.error);
  }

  return json;
}

function pathQuery(path: string, query: { [key: string]: string }): string {
  const params = new URLSearchParams(query);
  return `${path}?${params}`;
}

export default function CommitsPerWeek({
  repo,
  owner
}: {
  repo: string;
  owner: string;
}): JSX.Element {
  const { data, error = "" } = useSWR<{
    commits: {
      author: {
        email: string;
        name: string;
      };
      committedDate: string;
      message: string;
      oid: string;
    }[];
  }>(pathQuery("/api/commits", { repo, owner }), fetcher, {
    revalidateOnFocus: false
  });

  const commitsPerWeekContainer = useRef(null);

  const commits:
    | {
        date: string;
        count: number;
      }[]
    | undefined =
    data &&
    data.commits &&
    data.commits
      .reduce(
        (
          acc: {
            date: string;
            count: number;
          }[],
          value: {
            author: {
              email: string;
              name: string;
            };
            committedDate: string;
            message: string;
            oid: string;
          }
        ) => {
          const date = new Date(value.committedDate);

          const options = { month: "numeric", year: "numeric" };
          const yearMonth = new Intl.DateTimeFormat("en-US", options).format(
            date
          );

          const element = acc.find(el => el.date === yearMonth);
          if (element) {
            element.count += 1;
          } else {
            acc.push({
              date: yearMonth,
              count: 1
            });
          }

          return acc;
        },
        []
      )
      .reverse();

  useEffect(() => {
    if (commits && commitsPerWeekContainer.current) {
      const width = 1500;
      const height = 500;

      const margin = { top: 30, right: 0, bottom: 80, left: 40 };

      d3.selectAll("svg.commitsPerMonth > *").remove();
      const svg = d3
        .select(commitsPerWeekContainer.current)
        .attr("viewBox", `0, 0, ${width}, ${height}`);

      const x = d3
        .scaleBand()
        // @ts-ignore
        .domain(d3.range(commits.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        // @ts-ignore
        .domain([0, d3.max(commits, d => d.count)])
        .nice()
        .range([height - margin.bottom, margin.top]);

      // @ts-ignore
      const xAxis = (g): void =>
        g
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .attr("class", "xLabels")
          .call(
            d3
              .axisBottom(x)
              // @ts-ignore
              .tickFormat(i => commits[i].date)
              .tickPadding(10)
              .tickSizeOuter(0)
          );

      // @ts-ignore
      const yAxis = (g): void =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y))
          // @ts-ignore
          .call(g => g.select(".domain").remove());

      svg
        .append("g")
        .attr("fill", "#fff")
        .selectAll("rect")
        .data(commits)
        .join("rect")
        .attr("x", (d, i) => x(i))
        // @ts-ignore
        .attr("y", d => y(d.count))
        // @ts-ignore
        .attr("height", d => y(0) - y(d.count))
        .attr("width", x.bandwidth());

      svg
        .append("g")
        .attr("fill", "#fff")
        .selectAll("text")
        .data(commits)
        .join("text")
        .attr("text-anchor", "middle")
        .attr("x", function(d, i) {
          return x(i) + 23;
        })
        .attr("y", function(d) {
          return y(d.count);
        })
        .attr("dy", "-10px")
        // @ts-ignore
        .text(d => d.count);

      svg.append("g").call(xAxis);
      svg.append("g").call(yAxis);

      svg.exit().remove();
      d3.selectAll(".xLabels .tick text")
        .attr("transform", "translate(-10, 20) rotate(-45)")
        .attr("font-size", "16px");

      d3.selectAll("text").attr("font-size", "16px");
    }
  }, [commits, commitsPerWeekContainer.current]);

  return (
    <>
      {error && <div>{error.message}</div>}
      {!error && !data && <div>Loading</div>}
      {!error && data && (
        <div>
          <svg className="commitsPerMonth" ref={commitsPerWeekContainer}></svg>
          <style jsx>{`
            .chart {
              width: 100%;
              height: 500px;
              font-size: 16px;
            }
          `}</style>
        </div>
      )}
    </>
  );
}
