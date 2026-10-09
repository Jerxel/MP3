import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { bankersToText } from "@/lib/bankers"

const digits = (v) => v.replace(/\D/g, "")

export function BankersInputs({ total, onTotalChange, rows, onRowChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>2. Process details</CardTitle>
        <CardDescription>
          Enter the total resources, then each process ID, maximum need, and
          currently holding.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Total resources</Label>
          <Input
            type="text"
            inputMode="numeric"
            value={total}
            onChange={(e) => onTotalChange(digits(e.target.value))}
            placeholder="10"
          />
        </div>
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              {i === 0 && <Label className="text-xs text-muted-foreground">Process ID</Label>}
              <Input
                value={row.id}
                onChange={(e) => onRowChange(i, "id", e.target.value)}
                placeholder={`P${i + 1}`}
              />
            </div>
            <div className="space-y-1">
              {i === 0 && <Label className="text-xs text-muted-foreground">Max need</Label>}
              <Input
                type="text"
                inputMode="numeric"
                value={row.max}
                onChange={(e) => onRowChange(i, "max", digits(e.target.value))}
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              {i === 0 && <Label className="text-xs text-muted-foreground">Holding</Label>}
              <Input
                type="text"
                inputMode="numeric"
                value={row.holding}
                onChange={(e) => onRowChange(i, "holding", digits(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function BankersResult({ total, result }) {
  function handleDownload() {
    const blob = new Blob([bankersToText(total, result)], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "BANKERS.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Available resources</CardDescription>
            <CardTitle className="text-3xl">{result.available}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Safe sequences</CardDescription>
            <CardTitle className="text-3xl">
              {result.safeCount} / {result.combinations.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Process table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Process</TableHead>
                <TableHead>Max need</TableHead>
                <TableHead>Holding</TableHead>
                <TableHead>Need</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.processes.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.id}</TableCell>
                  <TableCell>{p.max}</TableCell>
                  <TableCell>{p.holding}</TableCell>
                  <TableCell>{p.need}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>Possible combinations of process</CardTitle>
            <CardDescription>Every ordering, marked SAFE or UNSAFE.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download />
            BANKERS.txt
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="max-h-96 space-y-1 overflow-y-auto font-mono text-sm">
            {result.combinations.map((c, i) => (
              <li key={i}>
                {c.order.join(" ")} -{" "}
                <span
                  className={
                    c.safe
                      ? "font-semibold text-green-600 dark:text-green-400"
                      : "font-semibold text-red-600 dark:text-red-400"
                  }
                >
                  {c.safe ? "SAFE" : "UNSAFE"}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  )
}
