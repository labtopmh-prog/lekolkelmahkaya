export async function requestLibraryNotifications(): Promise<{
  granted: boolean;
  message: string;
}> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return {
      granted: false,
      message: 'متصفحك الحالي لا يدعم إشعارات الويب المباشرة، وسيتم تفعيلها داخل تطبيق الهاتف.',
    };
  }

  if (Notification.permission === 'granted') {
    return { granted: true, message: 'الإشعارات الصباحية مفعلة لاقتباس اليوم.' };
  }

  const result = await Notification.requestPermission();
  if (result === 'granted') {
    new Notification('كل كلمة حكاية', {
      body: 'مرحبًا بك في المكتبة! ستصلك اقتباسات يومية لطيفة عند تفعيل الإشعارات.',
      icon: '/pwa-192x192.png',
    });
    return { granted: true, message: 'تم تفعيل الإشعارات بنجاح.' };
  }

  return {
    granted: false,
    message: 'لم يتم منح إذن الإشعارات من المتصفح.',
  };
}
