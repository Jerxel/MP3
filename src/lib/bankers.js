// Banker's Algorithm: enumerate every ordering of the processes and
// check whether that ordering is a SAFE sequence.

export function validateBankers(totalInput, rows) {
  const errors = []
  if (rows.length === 0) return ["Enter the number of processes first."]
  if (rows.length > 7) {
    return ["Banker's Algorithm supports up to 7 processes (7! = 5,040 permutations)."]
  }

  if (totalInput === "" || !/^\d+$/.test(totalInput)) {
    errors.push("Total resources must be a whole number ≥ 0.")
  }

  const seen = new Set()
  let held = 0
  rows.forEach((row, i) => {
    const label = `Process ${i + 1}`
    const id = row.id.trim()
    if (!id) errors.push(`${label}: process ID cannot be blank.`)
    else if (seen.has(id.toLowerCase())) errors.push(`${label}: process ID "${id}" is already used.`)
    else seen.add(id.toLowerCase())

    const maxOk = /^\d+$/.test(String(row.max))
    const holdOk = /^\d+$/.test(String(row.holding))
    if (!maxOk) errors.push(`${label}: maximum need is required (whole number ≥ 0).`)
    if (!holdOk) errors.push(`${label}: currently holding is required (whole number ≥ 0).`)
    if (maxOk && holdOk) {
      if (Number(row.holding) > Number(row.max)) {
        errors.push(`${label}: currently holding cannot exceed maximum need.`)
      }
      held += Number(row.holding)
    }
  })

  if (errors.length === 0 && held > Number(totalInput)) {
    errors.push(`Total currently held (${held}) exceeds total resources (${totalInput}).`)
  }
  return errors
}

function permutations(items) {
  const out = []
  const used = Array(items.length).fill(false)
  const current = []
  function walk() {
    if (current.length === items.length) {
      out.push([...current])
      return
    }
    for (let i = 0; i < items.length; i++) {
      if (used[i]) continue
      used[i] = true
      current.push(items[i])
      walk()
      current.pop()
      used[i] = false
    }
  }
  walk()
  return out
}

export function runBankers(total, processes) {
  const held = processes.reduce((s, p) => s + p.holding, 0)
  const initialAvailable = total - held
  const withNeed = processes.map((p) => ({ ...p, need: p.max - p.holding }))

  const combinations = permutations(withNeed).map((order) => {
    let available = initialAvailable
    let safe = true
    for (const p of order) {
      if (p.need <= available) available += p.holding
      else {
        safe = false
        break
      }
    }
    return { order: order.map((p) => p.id), safe }
  })

  return {
    available: initialAvailable,
    processes: withNeed,
    combinations,
    safeCount: combinations.filter((c) => c.safe).length,
  }
}

// Plain-text output in the same format as the sample.
export function bankersToText(total, result) {
  const lines = [`Total resources: ${total}`, `Available: ${result.available}`, ""]
  result.processes.forEach((p) =>
    lines.push(`${p.id}: max need ${p.max}, holding ${p.holding}, need ${p.need}`)
  )
  lines.push("", "Possible combinations of process")
  result.combinations.forEach((c) =>
    lines.push(`    ${c.order.join(" ")} - ${c.safe ? "SAFE" : "UNSAFE"}`)
  )
  return lines.join("\n") + "\n"
}
