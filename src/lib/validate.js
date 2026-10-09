export function validateProcesses(rows) {
  const errors = []

  if (rows.length === 0) {
    return ["Enter the number of processes first."]
  }

  const seenIds = new Set()
  const seenArrivals = new Map()

  rows.forEach((row, i) => {
    const label = `Process ${i + 1}`
    const id = row.id.trim()

    if (!id) {
      errors.push(`${label}: process ID cannot be blank.`)
    } else if (seenIds.has(id.toLowerCase())) {
      errors.push(`${label}: process ID "${id}" is already used.`)
    } else {
      seenIds.add(id.toLowerCase())
    }

    if (row.arrival === "" || row.arrival === null) {
      errors.push(`${label}: arrival time is required.`)
    } else if (!/^\d+$/.test(String(row.arrival))) {
      errors.push(`${label}: arrival time must be a whole number ≥ 0.`)
    } else {
      const arrival = Number(row.arrival)
      if (seenArrivals.has(arrival)) {
        errors.push(
          `${label}: has the same arrival time (${arrival}) as Process ${seenArrivals.get(arrival)}. Arrival times must be unique.`
        )
      } else {
        seenArrivals.set(arrival, i + 1)
      }
    }

    if (row.burst === "" || row.burst === null) {
      errors.push(`${label}: burst time is required.`)
    } else if (!/^\d+$/.test(String(row.burst)) || Number(row.burst) < 1) {
      errors.push(`${label}: burst time must be a whole number ≥ 1.`)
    }
  })

  return errors
}