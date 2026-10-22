rfm_query = """
WITH
    -- Find the snapshot date, which is one day after the last transaction in the whole dataset
    snapshot AS (
        SELECT date(MAX(InvoiceDate), '+1 day') AS snapshot_date
        FROM transactions
    ),
    -- Calculate raw RFM metrics for each customer
    rfm_metrics AS (
        SELECT
            CustomerID,
            MAX(date(InvoiceDate)) AS last_purchase_date,
            COUNT(DISTINCT InvoiceNo) AS Frequency,
            SUM(Quantity * UnitPrice) AS MonetaryValue
        FROM
            transactions
        WHERE
            CustomerID IS NOT NULL AND Quantity > 0 AND UnitPrice > 0
        GROUP BY
            CustomerID
    )
-- Final SELECT: Calculate Recency by comparing to the snapshot_date
SELECT
    m.CustomerID,
    (julianday(s.snapshot_date) - julianday(m.last_purchase_date)) AS Recency,
    m.Frequency,
    m.MonetaryValue
FROM
    rfm_metrics m, snapshot s;
"""
