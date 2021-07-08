<?php


namespace App\Miscs;


class Calculator
{

    public static function floatAdd(float|int $a, float|int $b, $precision = 0): float|int
    {
        return round($a + $b, $precision);
//        return (float) bcadd($a, $b, $precision);
    }

    public static function floatSub(float|int $a, float|int $b, $precision = 0): float|int
    {
        return round($a - $b, $precision);
//        return (float) bcsub($a, $b, $precision);
    }

    public static function floatMul($a, $b, $precision = 0): float
    {
        return round($a * $b, $precision);
//        return (float) bcmul($a, $b, $precision);
    }

    public static function floatDiv($a, $b, $precision = 3): float
    {
//        return round(bcdiv($a, $b, $precision), $precision);
        return round($a / $b, $precision);
//        return (float) bcdiv($a, $b, $precision);
    }

}
