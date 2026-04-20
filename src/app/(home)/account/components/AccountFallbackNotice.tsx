type AccountFallbackNoticeProps = {
  message: string;
};

export default function AccountFallbackNotice({
  message,
}: AccountFallbackNoticeProps) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      {message}
    </div>
  );
}
