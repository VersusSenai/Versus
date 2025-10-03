// Mock do ImageService
export default {
  upload: jest.fn().mockResolvedValue({ url: 'https://mock-image-url.com/image.jpg' }),
  delete: jest.fn().mockResolvedValue(true),
  getUrl: jest.fn().mockReturnValue('https://mock-image-url.com/image.jpg'),
};