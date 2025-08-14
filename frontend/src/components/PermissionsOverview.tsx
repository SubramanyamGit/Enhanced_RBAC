import React, { useMemo, useState } from "react";
import { Accordion, Badge, Card, Col, Form, Row, Table } from "react-bootstrap";

const humanize = (s) =>
  String(s)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

const PermissionsOverview = ({
  permissions,
  title = "Your Access Overview",
}) => {
  const [query, setQuery] = useState("");

  // Ensure a safe object type { [key: string]: string[] }
  const safePermissions = useMemo(() => {
    if (!permissions || typeof permissions !== "object") return {};
    const out = {};
    (Object.entries(permissions) as [string, string[]][]).forEach(([k, v]) => {
      if (Array.isArray(v)) out[k] = v.filter((x) => typeof x === "string");
    });
    return out;
  }, [permissions]);

  const totals = useMemo(() => {
    const total = Object.values(
      safePermissions as Record<string, string[]>
    ).reduce((acc, arr) => acc + arr.length, 0);
    const modules = Object.keys(safePermissions).length;
    return { total, modules };
  }, [safePermissions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return safePermissions;

    const result = {};
    (Object.entries(safePermissions) as [string, string[]][]).forEach(
      ([module, perms]) => {
        const matchModule = module.toLowerCase().includes(q);
        const list = matchModule
          ? perms
          : perms.filter((p) => p.toLowerCase().includes(q));
        if (list.length) result[module] = list;
      }
    );
    return result;
  }, [safePermissions, query]);

  const hasAny = totals.total > 0;

  return (
    <Card className="shadow-sm border-0">
      <Card.Body>
        <Row className="align-items-center g-3 mb-3">
          <Col md={6}>
            <h5 className="mb-1">{title}</h5>
            <div className="text-muted">
              <Badge bg="primary" className="me-2">
                {totals.total} permissions
              </Badge>
              <Badge bg="light" text="dark">
                {totals.modules} modules
              </Badge>
            </div>
          </Col>
          <Col md={6}>
            <Form.Control
              placeholder="Search by module or permission…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search permissions"
            />
          </Col>
        </Row>

        {!hasAny ? (
          <div className="text-muted">You don’t have any permissions yet.</div>
        ) : Object.keys(filtered).length === 0 ? (
          <div className="text-muted">No permissions match your search.</div>
        ) : (
          <Accordion alwaysOpen>
            {(Object.entries(filtered) as [string, string[]][]).map(
              ([module, perms], idx) => (
                <Accordion.Item eventKey={String(idx)} key={module}>
                  <Accordion.Header>
                    <span className="me-2 text-capitalize">
                      {humanize(module)}
                    </span>
                    <Badge bg="light" text="dark" className="ms-2">
                      {perms.length}
                    </Badge>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Table responsive hover className="mb-0">
                      <thead>
                        <tr>
                          <th style={{ width: "60%" }}>Permission</th>
                          <th style={{ width: "40%" }}>Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {perms
                          .slice()
                          .sort((a, b) => a.localeCompare(b))
                          .map((p) => (
                            <tr key={`${module}:${p}`}>
                              <td className="text-capitalize">{humanize(p)}</td>
                              <td className="text-capitalize">
                                {humanize(module)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
              )
            )}
          </Accordion>
        )}
      </Card.Body>
    </Card>
  );
};

export default PermissionsOverview;
