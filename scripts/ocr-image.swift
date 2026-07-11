import Vision
import AppKit

let args = CommandLine.arguments
guard args.count >= 2 else {
    fputs("Usage: ocr-image.swift <image-path>\n", stderr)
    exit(1)
}

let url = URL(fileURLWithPath: args[1])
guard let img = NSImage(contentsOf: url),
      let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    fputs("Failed to load image\n", stderr)
    exit(1)
}

let req = VNRecognizeTextRequest()
req.recognitionLevel = .accurate
req.usesLanguageCorrection = true

let handler = VNImageRequestHandler(cgImage: cg, options: [:])
do {
    try handler.perform([req])
    for obs in req.results ?? [] {
        if let line = obs.topCandidates(1).first?.string {
            print(line)
        }
    }
} catch {
    fputs("OCR error: \(error)\n", stderr)
    exit(1)
}
