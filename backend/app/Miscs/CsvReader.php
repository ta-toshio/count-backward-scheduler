<?php


namespace App\Miscs;


use League\Csv\Reader;

class CsvReader
{
    /**
     * @var Reader|\Iterator
     */
    protected $csv;

    /**
     * @return array|string[]
     */
    public function getHeader()
    {
        return $this->csv->getHeader();
    }

    /**
     * @param int $offset
     *
     * @throws \League\Csv\Exception
     */
    public function setHeaderOffset($offset = 0)
    {
        $this->csv->setHeaderOffset($offset);
    }

    /**
     * @param $document
     * @param int $header
     * @param string $delimiter
     * @return $this
     * @throws \League\Csv\Exception
     */
    public function parse($document, $header = 0, $delimiter = ',')
    {
        $this->csv = static::initReader($document);
        $this->csv->setDelimiter($delimiter);
        if ($header !== false) {
            $this->csv->setHeaderOffset($header);
        }

        return $this;
    }

    /**
     * @return array
     */
    public function get(): array
    {
        $items = [];

        foreach ($this->csv as $item) {
            $items[] = array_map('trim', $item);
        }

        return $items;
    }

    /**
     * @return \Generator
     */
    public function each(): \Generator
    {
        foreach ($this->csv as $item) {
            yield array_map('trim', $item);
        }
    }

    /**
     * @param $document
     * @return Reader
     * @throws \League\Csv\Exception
     */
    protected static function initReader($document) {
        if ($document instanceof \SplFileObject) {
            return Reader::createFromPath($document);
        }

        if (\is_resource($document)) {
            return Reader::createFromStream($document);
        }

        if (file_exists($document)) {
            return Reader::createFromPath($document);
        }

        if (!empty($document) && strpos($document, ',') === false) {
            throw new \League\Csv\Exception('This should not be csv.');
        }

        $encoding = mb_detect_encoding($document, 'SJIS-win,EUC-JP,UTF-8,WINDOWS-1252,ISO-8859-15,ISO-8859-1,ASCII');
        if (!$encoding) {
            $encoding = 'UTF-8';
        }

        $document = mb_convert_encoding($document, 'UTF-8', $encoding);

        return Reader::createFromString($document);
    }

}
