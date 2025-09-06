export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container grid gap-6 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold">EvoWatch</p>
          <p className="mt-2 text-sm text-muted-foreground">
            AI-powered genomic surveillance for multi-pathogen early warning.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Solution</p>
          <ul className="mt-2 space-y-1">
            <li><a href="#pipeline" className="hover:text-foreground">Pipeline</a></li>
            <li><a href="#visuals" className="hover:text-foreground">Visualizations</a></li>
            <li><a href="#impact" className="hover:text-foreground">Impact</a></li>
          </ul>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Legal</p>
          <ul className="mt-2 space-y-1">
            <li>© {new Date().getFullYear()} EvoWatch</li>
            <li>All rights reserved.</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
