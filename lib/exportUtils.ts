/**
 * Download an array of objects as a formatted CSV file
 */
export function exportToCSV<T extends Record<string, any>>(
  filename: string,
  rows: T[],
  headers: { key: keyof T; label: string }[]
) {
  if (!rows || !rows.length) return;

  const separator = ",";
  const keys = headers.map((h) => h.key);

  const csvContent =
    headers.map((h) => `"${h.label.replace(/"/g, '""')}"`).join(separator) +
    "\n" +
    rows
      .map((row) => {
        return keys
          .map((key) => {
            let rawVal: any = row[key];
            if (rawVal === null || rawVal === undefined) {
              rawVal = "";
            } else if (typeof rawVal === "object") {
              rawVal = rawVal.name || rawVal.title || JSON.stringify(rawVal);
            }
            const stringVal = String(rawVal).replace(/"/g, '""');
            return `"${stringVal}"`;
          })
          .join(separator);
      })
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download an array of objects as a JSON file
 */
export function exportToJSON<T>(filename: string, data: T[]) {
  if (!data || !data.length) return;

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const link = document.createElement("a");
  link.setAttribute("href", jsonString);
  link.setAttribute("download", `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
