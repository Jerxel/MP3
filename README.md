# CPU Scheduling Simulator

A React + Vite app (JavaScript, shadcn/ui, Tailwind v4) that simulates two
non-preemptive CPU scheduling algorithms, **FCFS** and **SJF**, and reports
each process's completion, turnaround, and waiting time, plus averages. It also
includes the **Banker's Algorithm**, which lists every possible ordering of
processes and marks each one SAFE or UNSAFE.
Built for Machine Problem #2 and #3 (Operating Systems).

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## How it works

1. **Set the number of processes** (3-10).
2. **Choose an algorithm** (FCFS, SJF, or Banker's) and enter the process
   details for it.
3. Click **Compute** to see the results.

### FCFS and SJF

Enter each process's ID, arrival time, and burst time. Inputs are validated:
IDs must be non-blank and unique, arrival times must be whole numbers >= 0 and
unique, and burst times must be whole numbers >= 1.

Results show a Gantt-style execution timeline, a per-process table
(completion / turnaround / waiting time), and the averages.

SJF here is non-preemptive: at any idle moment it picks the shortest burst
among processes that have already arrived, and ties are broken by earliest
arrival then by original input order (falls back to FCFS behavior on ties,
per the assignment spec). The scheduling logic lives in
`src/lib/scheduling.js`.

### Banker's Algorithm

Enter the total resources, then each process's ID, maximum need, and
currently holding. Inputs are validated: IDs must be non-blank and unique,
holding cannot exceed maximum need, and the total held cannot exceed the total
resources. Banker's supports up to 7 processes (7! = 5,040 orderings).

Results show the available resources, a table of each process's maximum need,
holding, and remaining need, and every possible ordering of the processes
marked SAFE or UNSAFE. An ordering is SAFE when every process, in that order,
can get its remaining need from the available resources and then release what
it holds. The **BANKERS.txt** button downloads the list as a text file.

Example: total 10, with P1 (max 8, holding 1), P2 (max 5, holding 3) and
P3 (max 9, holding 3) gives only `P2 P3 P1` as SAFE.

The logic lives in `src/lib/bankers.js` and the UI in
`src/components/BANKERS.jsx`.

## Theme

Light/dark mode is toggled from the header (saved to `localStorage`) and
uses the shadcn design tokens from `src/index.css`.

## Tech stack

- React 19 + Vite
- Tailwind CSS v4
- shadcn/ui primitives (Button, Input, Select, Card, Table, Switch, Alert)
- lucide-react icons