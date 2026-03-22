export default function ProgressBar({ percent }) {
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height: '4px', background: 'var(--off-white)' }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${percent}%`,
          background: 'var(--saffron)',
          transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  );
}
